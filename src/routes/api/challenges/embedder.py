import numpy as np
import sys
import numpy as np
import tensorflow as tf
from tensorflow.keras.applications import VGG16
from tensorflow.keras.applications.vgg16 import preprocess_input
from tensorflow.keras.preprocessing import image
from sklearn.metrics.pairwise import cosine_similarity
import os

# Load pre-trained VGG16 model
model = VGG16(weights='imagenet', include_top=False)

# Function to compute embeddings for an image
def compute_embedding(img_path, model):
    # Load and preprocess image
    img = image.load_img(img_path, target_size=(224, 224))
    img_array = image.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0)
    img_array = preprocess_input(img_array)

    # Obtain feature map from an intermediate layer
    intermediate_layer_model = tf.keras.Model(inputs=model.input,
                                               outputs=model.get_layer('block5_conv2').output)
    feature_map = intermediate_layer_model.predict(img_array)

    # Flatten feature map to obtain embedding
    embedding = feature_map.flatten()
    return embedding

cwd =  os.path.dirname(os.path.realpath(__file__))
 
image1_path = f'{cwd}/data/image1.png'
image2_path = f'{cwd}/data/image2.png'

sys.stdout = open(os.devnull, 'w')
sys.stderr = open(os.devnull, 'w')

embedding1 = compute_embedding(image1_path, model)
embedding2 = compute_embedding(image2_path, model)

# Reshape embeddings to ensure they're 2D arrays
embedding1 = embedding1.reshape(1, -1)
embedding2 = embedding2.reshape(1, -1)

# Calculate cosine similarity between the embeddings
cosine_sim = cosine_similarity(embedding1, embedding2)

sys.stdout = sys.__stdout__
sys.stderr = sys.__stderr__

print(cosine_sim[0][0])