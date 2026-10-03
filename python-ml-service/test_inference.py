import requests
import json
import pandas as pd

# High quality image: clear, high resolution
url_a = "https://picsum.photos/id/237/800/600"

# Low quality image: small, pixelated
url_b = "https://picsum.photos/id/237/100/100"

def test_api(name, url):
    payload = {
        "publicId": name,
        "secureUrl": url
    }
    response = requests.post("http://127.0.0.1:8001/api/ml/analyze", json=payload)
    if response.status_code == 200:
        return response.json()["intelligence"]
    else:
        print(f"Error for {name}: {response.text}")
        return None

res_a = test_api("test_high_res", url_a)
res_b = test_api("test_low_res", url_b)

if res_a and res_b:
    data = {
        "Metric": [
            "Resolution", "Brightness", "Contrast", "Sharpness", "Entropy",
            "Quality prediction", "Quality probability", "ResNet class", 
            "Embedding", "Similarity (Score)", "Anomaly risk", "Recommendations", "Processing time (Total ms)"
        ],
        "Image A": [
            res_a["features"]["Resolution"],
            res_a["features"]["Brightness"],
            res_a["features"]["Contrast"],
            res_a["features"]["Sharpness"],
            res_a["features"]["Entropy"],
            res_a["quality"]["prediction"],
            round(max(res_a["quality"]["probabilities"].values()) * 100, 2),
            res_a["vision"]["classification"][0]["label"],
            f'{res_a["vision"]["embedding_dimensions"]}D',
            res_a["similarity"]["score"],
            res_a["anomaly"]["risk"],
            ", ".join(res_a["decisions"]),
            sum(res_a.get("timings", {}).values())
        ],
        "Image B": [
            res_b["features"]["Resolution"],
            res_b["features"]["Brightness"],
            res_b["features"]["Contrast"],
            res_b["features"]["Sharpness"],
            res_b["features"]["Entropy"],
            res_b["quality"]["prediction"],
            round(max(res_b["quality"]["probabilities"].values()) * 100, 2),
            res_b["vision"]["classification"][0]["label"],
            f'{res_b["vision"]["embedding_dimensions"]}D',
            res_b["similarity"]["score"],
            res_b["anomaly"]["risk"],
            ", ".join(res_b["decisions"]),
            sum(res_b.get("timings", {}).values())
        ]
    }
    df = pd.DataFrame(data)
    markdown_str = df.to_markdown(index=False)
    with open("results.md", "w", encoding="utf-8") as f:
        f.write(markdown_str)
    print("Results saved to results.md")
