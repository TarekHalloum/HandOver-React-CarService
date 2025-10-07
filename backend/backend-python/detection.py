from ultralytics import YOLO
from PIL import Image, ImageDraw, ImageFont
from pathlib import Path

def detect_car(img: Image):
    model = YOLO('detection_model.pt')
    results = model(img)

    draw = ImageDraw.Draw(img)
    font = ImageFont.load_default()
    detected_brand = None

    for result in results:
        for box in result.boxes:
            x1, y1, x2, y2 = map(int, box.xyxy[0])
            cls_id = int(box.cls[0])
            label = model.names[cls_id]
            confidence = box.conf[0]

            detected_brand = label  # assume only one brand
            draw.rectangle([x1, y1, x2, y2], outline='blue', width=3)
            text = f"{label} {confidence:.0%}"

            text_bbox = draw.textbbox((x1, y1), text, font=font)
            text_width = text_bbox[2] - text_bbox[0]
            text_height = text_bbox[3] - text_bbox[1]

            draw.rectangle([0, 0, text_width + 10, text_height + 10], fill="blue")
            draw.text((5, 5), text, fill="white", font=font)

    img.save('car_detection.jpg')
    return img, detected_brand


def detect_damage(car_img: Image):
    model = YOLO('damage_model.pt')
    results = model(car_img)

    draw = ImageDraw.Draw(car_img)
    font = ImageFont.load_default()
    damaged_parts = []

    for result in results:
        for box in result.boxes:
            x1, y1, x2, y2 = map(int, box.xyxy[0])
            cls_id = int(box.cls[0])
            label = model.names[cls_id]
            confidence = box.conf[0]

            damaged_parts.append(label)
            draw.rectangle([x1, y1, x2, y2], outline='red', width=3)
            text = f"{label} {confidence:.0%}"

            text_bbox = draw.textbbox((x1, y1), text, font=font)
            text_width = text_bbox[2] - text_bbox[0]
            text_height = text_bbox[3] - text_bbox[1]

            draw.rectangle([x1, y1, x1 + text_width + 10, y1 + text_height + 10], fill="red")
            draw.text((x1 + 5, y1 + 5), text, fill="white", font=font)

    car_img.save('damage_detection.jpg')
    return car_img, damaged_parts
