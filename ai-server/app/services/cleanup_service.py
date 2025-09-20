from google.cloud import vision
from difflib import SequenceMatcher

client = vision.ImageAnnotatorClient()

# Trash-related keywords for fuzzy matching
TRASH_KEYWORDS = [
    "trash", "garbage", "plastic bottle", "wrapper", "can", "paper", "rubbish", "bottle"
]

CONFIDENCE_THRESHOLD = 0.7  # Only count objects/labels above this confidence

def keyword_match(text):
    """Return True if text matches any trash keyword (fuzzy)."""
    text = text.lower()
    for kw in TRASH_KEYWORDS:
        ratio = SequenceMatcher(None, kw, text).ratio()
        if ratio > 0.7:  # Adjustable threshold
            return True
    return False

async def analyze_cleanup(before_bytes: bytes, after_bytes: bytes):
    def detect_objects_and_labels(image_bytes):
        """Detect objects and labels with confidence from Google Vision API."""
        image = vision.Image(content=image_bytes)

        # Object localization
        obj_response = client.object_localization(image=image)
        obj_labels_conf = [
            (obj.name.lower(), obj.score) for obj in obj_response.localized_object_annotations
        ]

        # Label detection
        label_response = client.label_detection(image=image)
        label_labels_conf = [
            (label.description.lower(), label.score) for label in label_response.label_annotations
        ]

        # Combine all labels and confidence
        all_labels_conf = list(set(obj_labels_conf + label_labels_conf))
        return all_labels_conf

    # Get labels with confidence
    before_labels_conf = detect_objects_and_labels(before_bytes)
    after_labels_conf = detect_objects_and_labels(after_bytes)

    # Count trash items using fuzzy matching + confidence threshold
    before_trash = sum(
        1 for label, conf in before_labels_conf if conf >= CONFIDENCE_THRESHOLD and keyword_match(label)
    )
    after_trash = sum(
        1 for label, conf in after_labels_conf if conf >= CONFIDENCE_THRESHOLD and keyword_match(label)
    )

    # Determine if area cleaned
    cleaned = after_trash < before_trash

    # Weighted cleanliness score
    if before_trash == 0:
        cleanliness_score = 100 if cleaned else 0
    else:
        cleanliness_score = max(
            0, min(100, int((before_trash - after_trash) / before_trash * 100))
        )

    # Detailed explanation
    explanation = (
        f"Before image had {before_trash} potential trash items, "
        f"after image has {after_trash}. "
        f"Area cleaned: {cleaned}. "
        f"Objects detected before: {[label for label, conf in before_labels_conf if keyword_match(label)]}. "
        f"Objects detected after: {[label for label, conf in after_labels_conf if keyword_match(label)]}."
    )

    return {
        "cleaned": cleaned,
        "cleanliness_score": cleanliness_score,
        "explanation": explanation
    }
