from flask import Flask, request, jsonify
from chromadb.utils.embedding_functions import GoogleGenerativeAiEmbeddingFunction
import chromadb
import json
from utils.kill_process import find_and_kill_process_by_port

app = Flask(__name__)


class ChromaNotConfiguredException(Exception):
    pass

# Global ChromaDB client
chroma_client = None

def check_embed_function():
    embedding_function_name = app.config['chroma_config'].get('embedding_function', None)
    embed_api_key = app.config['chroma_config'].get('embed_api_key', None)
    if embedding_function_name == 'gemini':
        return GoogleGenerativeAiEmbeddingFunction(api_key=embed_api_key)
    else:
        print(f'Unsupported embedding function: {embedding_function_name}')

def init_chroma_client():
    global chroma_client
    if 'chroma_config' in app.config:
        chroma_settings = chromadb.get_settings()
        chroma_settings.is_persistent = app.config['chroma_config'].get('is_persistent')
        chroma_client = chromadb.Client(chroma_settings)
    else:
        raise ChromaNotConfiguredException("Chroma DB not configured, POST to `/configure`")
    
    


@app.route('/configure', methods=['POST'])
def configure_chroma():
    """
    Endpoint to configure the ChromaDB client.
    Accepts the following parameters:
    - is_persistent (bool): Whether the database should be persistent or not.
    - embedding_function (str): The name of the embedding function to use ('GoogleGenerativeAiEmbeddingFunction' by default).
    - api_key (str): The API key for the embedding function (if required).
    """
    data = request.get_json()
    is_persistent = data.get('is_persistent', True)
    embedding_function_name = data.get('embedding_function', None)
    embed_api_key = data.get('embed_api_key', None)

    new_chroma_config = { 
        'is_persistent': is_persistent, 
        'embedding_function_name': embedding_function_name, 
        'embed_api_key': embed_api_key 
    }

    app.config['chroma_config'] = new_chroma_config



    with open('config.json', 'r+') as f:
        json.dump({'chroma_config': new_chroma_config}, f)

    init_chroma_client()

    return jsonify({'message': f'ChromaDB configuration updated successfully: {app.config["chroma_config"]}'})

@app.route('/collections', methods=['GET'])
def list_collections():
    """
    Endpoint to list all available collections.
    """
    if chroma_client is None:
        return jsonify({'error': 'ChromaDB client is not configured'}), 500

    collections = chroma_client.list_collections()
    return jsonify({'collections': [c.name for c in collections]})

@app.route('/collections/<name>', methods=['GET', 'POST', 'DELETE'])
def manage_collection(name):
    """
    Endpoint to manage a collection.
    GET: Retrieve the collection.
    POST: Create or update a collection.
    DELETE: Delete a collection.
    """
    if chroma_client is None:
        try:
            init_chroma_client()
        except ChromaNotConfiguredException as cnce:
            return jsonify({'error': str(cnce)}), 500

    collection_kwargs = {
        'name': name,
    }
    embed_func = check_embed_function()
    if embed_func:
        collection_kwargs['embedding_function'] = embed_func

    collection = chroma_client.get_or_create_collection(**collection_kwargs)

    if request.method == 'GET':
        return jsonify(collection.info)
    elif request.method == 'POST':
        data = request.get_json()
        documents = data.get('documents', [])
        ids = data.get('ids', [])
        metadatas = data.get('metadatas', [])
        add_kwargs = {
            'documents': documents,
        }
        if len(ids) > 0:
            add_kwargs['ids'] = ids
        if len(metadatas) > 0:
            add_kwargs['metadatas'] = metadatas
        collection.add(**add_kwargs)
        return jsonify({'message': f'Data inserted into collection "{name}"'})
    elif request.method == 'DELETE':
        chroma_client.delete_collection(name)
        return jsonify({'message': f'Collection "{name}" deleted'})

@app.route('/collections/<name>/documents', methods=['GET', 'POST', 'PUT', 'DELETE'])
def manage_documents(name):
    """
    Endpoint to manage documents in a collection.
    GET: Retrieve documents from the collection.
    POST: Insert new documents into the collection.
    PUT: Update existing documents in the collection.
    DELETE: Delete documents from the collection.
    """
    if chroma_client is None:
        try:
            init_chroma_client()
        except ChromaNotConfiguredException as cnce:
            return jsonify({'error': str(cnce)}), 500

    collection_kwargs = {
        'name': name,
    }
    embed_func = check_embed_function()
    if embed_func:
        collection_kwargs['embedding_function'] = embed_func

    collection = chroma_client.get_or_create_collection(**collection_kwargs)

    if request.method == 'GET':
        query = request.args.get('query', '')
        results = collection.query(
            query_texts=[query]
        )
        return jsonify(results)
    elif request.method == 'POST':
        data = request.get_json()
        documents = data.get('documents', [])
        ids = data.get('ids', [])
        metadatas = data.get('metadatas', [])
        collection.add(
            documents=documents,
            ids=ids,
            metadatas=metadatas
        )
        return jsonify({'message': f'Data inserted into collection `{name}`'})
    elif request.method == 'PUT':
        data = request.get_json()
        documents = data.get('documents', [])
        ids = data.get('ids', [])
        metadatas = data.get('metadatas', [])
        collection.update(
            ids=ids,
            metadatas=metadatas,
            documents=documents
        )
        return jsonify({'message': f'Data updated in collection `{name}`'})
    elif request.method == 'DELETE':
        data = request.get_json()
        ids = data.get('ids', [])
        collection.delete(ids=ids)
        return jsonify({'message': f'Data deleted from collection `{name}`'})



def main():
    saved_config = None
    PORT = 5000
    try:
        with open('config.json', 'r') as f:
            saved_config = json.load(f)
    except FileNotFoundError:
        with open('config.json', 'w') as f:
            json.dump({}, f)
    
    if saved_config:
        for k in saved_config:
            app.config[k] = saved_config[k]
        PORT = saved_config.get("flask_port", 5000)
    
    find_and_kill_process_by_port(PORT)
    
    app.run(host='localhost', port=PORT)

if __name__ == '__main__':
    main()