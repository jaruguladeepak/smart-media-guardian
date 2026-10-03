import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.tree import DecisionTreeClassifier
from sklearn.metrics import accuracy_score, f1_score, confusion_matrix, classification_report
import joblib

def generate_dataset(n_samples=500):
    # Same logic as train_model.py to ensure we have data
    np.random.seed(42)
    
    n_per_class = n_samples // 4
    
    # 1. Excellent Quality (High res, good brightness/contrast, very sharp, high color variance, low compression)
    excellent = pd.DataFrame({
        'Resolution': np.random.normal(8000000, 1000000, n_per_class),
        'AspectRatio': np.random.normal(1.77, 0.1, n_per_class),
        'Brightness': np.random.normal(128, 20, n_per_class),
        'Contrast': np.random.normal(60, 10, n_per_class),
        'Sharpness': np.random.normal(1500, 300, n_per_class),
        'EdgeDensity': np.random.normal(0.08, 0.02, n_per_class),
        'ColorVariance': np.random.normal(3000, 500, n_per_class),
        'Compression': np.random.normal(95, 5, n_per_class),
        'Entropy': np.random.normal(7.5, 0.3, n_per_class),
        'QualityLabel': ['Excellent'] * n_per_class
    })

    # 2. Good Quality
    good = pd.DataFrame({
        'Resolution': np.random.normal(4000000, 800000, n_per_class),
        'AspectRatio': np.random.normal(1.77, 0.2, n_per_class),
        'Brightness': np.random.normal(110, 25, n_per_class),
        'Contrast': np.random.normal(50, 15, n_per_class),
        'Sharpness': np.random.normal(800, 200, n_per_class),
        'EdgeDensity': np.random.normal(0.05, 0.015, n_per_class),
        'ColorVariance': np.random.normal(2000, 400, n_per_class),
        'Compression': np.random.normal(80, 10, n_per_class),
        'Entropy': np.random.normal(6.5, 0.5, n_per_class),
        'QualityLabel': ['Good'] * n_per_class
    })

    # 3. Average Quality
    average = pd.DataFrame({
        'Resolution': np.random.normal(1000000, 300000, n_per_class),
        'AspectRatio': np.random.normal(1.33, 0.3, n_per_class),
        'Brightness': np.random.normal(90, 30, n_per_class),
        'Contrast': np.random.normal(40, 20, n_per_class),
        'Sharpness': np.random.normal(300, 100, n_per_class),
        'EdgeDensity': np.random.normal(0.03, 0.01, n_per_class),
        'ColorVariance': np.random.normal(1000, 300, n_per_class),
        'Compression': np.random.normal(60, 15, n_per_class),
        'Entropy': np.random.normal(5.0, 0.8, n_per_class),
        'QualityLabel': ['Average'] * n_per_class
    })

    # 4. Poor Quality
    poor = pd.DataFrame({
        'Resolution': np.random.normal(300000, 100000, n_per_class),
        'AspectRatio': np.random.normal(1.0, 0.5, n_per_class),
        'Brightness': np.random.normal(60, 40, n_per_class),
        'Contrast': np.random.normal(20, 15, n_per_class),
        'Sharpness': np.random.normal(80, 40, n_per_class),
        'EdgeDensity': np.random.normal(0.01, 0.005, n_per_class),
        'ColorVariance': np.random.normal(400, 200, n_per_class),
        'Compression': np.random.normal(30, 20, n_per_class),
        'Entropy': np.random.normal(3.0, 1.0, n_per_class),
        'QualityLabel': ['Poor'] * n_per_class
    })

    df = pd.concat([excellent, good, average, poor], ignore_index=True)
    df = df.sample(frac=1, random_state=42).reset_index(drop=True)
    
    # Clip realistic bounds
    df['Brightness'] = df['Brightness'].clip(0, 255)
    df['Compression'] = df['Compression'].clip(1, 100)
    
    return df

def train_dynamic_model(model_type, save=False):
    """
    Trains a model dynamically and returns evaluation metrics.
    """
    df = generate_dataset(n_samples=1000)
    
    X = df.drop('QualityLabel', axis=1)
    y = df['QualityLabel']
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.25, random_state=42, stratify=y)
    
    if model_type == 'Random Forest':
        model = RandomForestClassifier(n_estimators=100, random_state=42)
    elif model_type == 'Gradient Boosting':
        model = GradientBoostingClassifier(n_estimators=100, random_state=42)
    elif model_type == 'Decision Tree':
        model = DecisionTreeClassifier(random_state=42)
    elif model_type == 'Logistic Regression':
        # Need scaling for LR to work well, but for demo we just increase max_iter
        model = LogisticRegression(max_iter=1000, random_state=42)
    else:
        raise ValueError("Unsupported model type")

    # Train
    model.fit(X_train, y_train)
    
    # Evaluate
    y_pred = model.predict(X_test)
    acc = float(accuracy_score(y_test, y_pred))
    f1 = float(f1_score(y_test, y_pred, average='macro'))
    
    # Cross Validation
    cv_scores = cross_val_score(model, X, y, cv=5)
    cv_mean = float(np.mean(cv_scores))
    
    # Confusion Matrix
    cm = confusion_matrix(y_test, y_pred, labels=['Poor', 'Average', 'Good', 'Excellent'])
    
    # Feature Importances (if available)
    feature_importances = []
    if hasattr(model, 'feature_importances_'):
        importances = model.feature_importances_
        feature_names = X.columns
        feature_importances = [{"name": name, "weight": float(weight)} for name, weight in zip(feature_names, importances)]
        feature_importances.sort(key=lambda x: x['weight'], reverse=True)
    
    if save:
        joblib.dump(model, "quality_model_dynamic.joblib")
        
    return {
        "model_type": model_type,
        "metrics": {
            "accuracy": acc,
            "f1_score": f1,
            "cv_mean": cv_mean,
            "holdout_size": len(y_test)
        },
        "confusion_matrix": cm.tolist(),
        "feature_importances": feature_importances,
        "labels": ['Poor', 'Average', 'Good', 'Excellent']
    }
