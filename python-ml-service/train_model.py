import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.metrics import classification_report, accuracy_score
import joblib
import os

def generate_synthetic_data(num_samples=10000):
    np.random.seed(42)
    
    # Generate entirely random plausible feature distributions
    resolution = np.random.uniform(10000, 8000000, num_samples)
    aspect_ratio = np.random.uniform(0.5, 2.5, num_samples)
    brightness = np.random.uniform(0.1, 0.9, num_samples)
    contrast = np.random.uniform(0.1, 0.9, num_samples)
    sharpness = np.random.uniform(0.001, 1.0, num_samples) # laplacian variance
    edge_density = np.random.uniform(0.001, 0.5, num_samples)
    color_variance = np.random.uniform(0.01, 0.5, num_samples)
    compression = np.random.uniform(0.0, 1.0, num_samples)
    entropy = np.random.uniform(1.0, 8.0, num_samples)
    
    labels = []
    
    for i in range(num_samples):
        res = resolution[i]
        sharp = sharpness[i]
        comp = compression[i]
        ent = entropy[i]
        
        # Human-intuitive rules for quality
        if comp > 0.85 or sharp < 0.005 or res < 100000:
            # Extremely degraded features force Poor
            labels.append('Poor')
        elif res >= 2000000 and sharp >= 0.05 and comp <= 0.3 and ent >= 5.0:
            # High res + good sharpness + low compression
            labels.append('Excellent')
        elif res >= 1000000 and sharp >= 0.02 and comp <= 0.5:
            # Good res + reasonable sharpness
            labels.append('Good')
        elif res < 1000000 and sharp >= 0.02 and comp <= 0.6:
            # Low res but reasonable sharpness/compression
            labels.append('Average')
        elif res >= 2000000 and (sharp < 0.01 or comp > 0.7 or ent < 4.0):
            # High res but ruined by blur or compression
            labels.append('Poor')
        else:
            # Everything else falls to Average
            labels.append('Average')
            
    df = pd.DataFrame({
        'Resolution': resolution,
        'AspectRatio': aspect_ratio,
        'Brightness': brightness,
        'Contrast': contrast,
        'Sharpness': sharpness,
        'EdgeDensity': edge_density,
        'ColorVariance': color_variance,
        'Compression': compression,
        'Entropy': entropy,
        'Label': labels
    })
    
    # Balance the dataset somewhat by oversampling the minority classes
    # to prevent the RF from just predicting Average
    max_size = df['Label'].value_counts().max()
    lst = [df]
    for class_index, group in df.groupby('Label'):
        lst.append(group.sample(max_size-len(group), replace=True))
    balanced_df = pd.concat(lst)
    
    return balanced_df.sample(frac=1).reset_index(drop=True)

def train_and_save():
    print("Generating robust synthetic dataset...")
    df = generate_synthetic_data(10000)
    
    # Save dataset for the "Dataset Explorer" UI later
    df.to_csv('media_features.csv', index=False)
    
    X = df.drop('Label', axis=1)
    y = df['Label']
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
    
    print("Training Random Forest Classifier...")
    model = RandomForestClassifier(n_estimators=300, max_depth=20, min_samples_split=5, random_state=42, n_jobs=-1)
    
    # Perform Cross-Validation
    print("Evaluating with 5-Fold Cross-Validation...")
    cv_scores = cross_val_score(model, X_train, y_train, cv=5)
    print(f"Cross-Validation Accuracy: {cv_scores.mean() * 100:.2f}% (+/- {cv_scores.std() * 2 * 100:.2f}%)")
    
    model.fit(X_train, y_train)
    
    y_pred = model.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    print(f"\nModel Accuracy on Holdout Test Set: {accuracy * 100:.2f}%")
    print("\nClassification Report:")
    print(classification_report(y_test, y_pred))
    
    print("Saving production-ready model to disk...")
    joblib.dump(model, 'quality_model.joblib')
    print("Done!")

if __name__ == "__main__":
    train_and_save()
