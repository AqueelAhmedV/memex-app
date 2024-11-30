import { message } from 'antd';
import { 
    ChromaConfig, 
    ManageDocumentsApiProps, 
    ManageDocumentsMethod,
    ManageCollectionMethod,
    ManageCollectionApiProps
} from './vectordb_api_types'


type ChromaAPIMethods = {
    configureChroma: (config: ChromaConfig) => Promise<any>;
    listCollections: () => Promise<Array<string>>;
    manageCollection: <T extends ManageCollectionMethod>(options: ManageCollectionApiProps<T>) => Promise<any>;
    manageDocuments: <T extends ManageDocumentsMethod>(props: ManageDocumentsApiProps<T>) => Promise<any>;
  };


class ChromaAPI {
    baseUrl: string;

    constructor(baseUrl: string) {
        console.log("Constructed", baseUrl)
        this.baseUrl = baseUrl;
    }

    

    async configureChroma(config: ChromaConfig): Promise<any> {
        const response = await fetch(`${this.baseUrl}/configure`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(config)
        });
        return response.json();
    }

    async listCollections(): Promise<string[]> {
        console.log(this)
        const response = await fetch(`${this.baseUrl}/collections`);

        const data = await response.json();
        
        console.log(data)
        return data.collections;
    }

    async manageCollection<T extends ManageCollectionMethod>(options: ManageCollectionApiProps<T>): Promise<any> {
        // @ts-ignore
        let { collectionName, method, data } = options
        
        const response = await fetch(`${this.baseUrl}/collections/${collectionName}`, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        return response.json();
    }

    async manageDocuments<T extends ManageDocumentsMethod>({collectionName, method, data}: ManageDocumentsApiProps<T>): Promise<any> {
        if (!collectionName) throw { error: "Collection name not provided" }
        let url = `${this.baseUrl}/collections/${collectionName}/documents`;
        
        let fetchOpts: RequestInit = {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }
        if (method === 'GET') {
            // @ts-ignore
            url += `?query=${data.query}`
            delete fetchOpts.body
        }
        const response = await fetch(url, );
        return response.json();
    }

}

export async function handleRequest<T extends keyof ChromaAPIMethods>(method: T, ...args: Parameters<ChromaAPIMethods[T]>) {
    try {
        const chromaAPI = new ChromaAPI('http://localhost:5000');
        // @ts-ignore shutchyo bitchassup
        return await chromaAPI[method](...args);
    } catch (error) {
        let msg = error?.response?.message ?? error.message ??
        error?.error ?? error?.msg
        if (error?.name === 'TypeError' && error?.message.trim() === "Failed to fetch") {
            msg = new ChromaNotConnected().message
        }

        message.error(msg)
        
        console.log(`Error in ${method}:`, msg);
    }
  }





// chromaAPI.configureChroma({
//     is_persistent: true,
//     embedding_function: 'gemini',
//     embed_api_key: 'your_api_key_here'
// }).then(response => {
//     console.log(response);
// }).catch(error => {
//     console.error(error);
// });

// chromaAPI.listCollections().then(collections => {
//     console.log(collections);
// }).catch(error => {
//     console.error(error);
// });

// Example of managing a collection
// chromaAPI.manageCollection('example_collection', 'GET').then(collection => {
//     console.log(collection);
// }).catch(error => {
//     console.error(error);
// });

// Example of managing documents in a collection
// chromaAPI.manageDocuments('example_collection', 'GET', 'example_query').then(documents => {
//     console.log(documents);
// }).catch(error => {
//     console.error(error);
// });
