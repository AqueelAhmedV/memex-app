interface ChromaConfig {
    is_persistent: boolean;
    embedding_function: string | null;
    embed_api_key: string | null;
}

type ManageCollectionMethod = 'GET' | 'POST' | 'DELETE'
type ManageDocumentsMethod = 'GET' | 'POST' | 'PUT' | 'DELETE'

type DocumentMetadata = Array<Record<string, any>>

type ManageCollectionApiData<T extends ManageCollectionMethod> = T extends 'POST'? {
    ids: Array<string>,
    documents: Array<string>,
    metadatas?: DocumentMetadata 
}:never;

type ManageCollectionApiProps<T extends ManageCollectionMethod> = {
    collectionName: string,
    method: T
} & (T extends 'POST' ? {
    data: ManageCollectionApiData<T>
} : {});

type ManageDocumentsApiData<T extends ManageDocumentsMethod> = T extends 'POST' | 'PUT' ? {
  ids: Array<string>,
  documents: Array<string>,
  metadatas?: DocumentMetadata,
} : T extends 'DELETE'? {
    ids: Array<string>
} : T extends 'GET'? {
    query: string
}: never;

type ManageDocumentsApiProps<T extends ManageDocumentsMethod> = {
    collectionName: string,
    method: T,
    data: ManageDocumentsApiData<T>
}


export {
    ChromaConfig, 
    ManageCollectionMethod, 
    ManageCollectionApiProps, 
    ManageDocumentsMethod, 
    ManageDocumentsApiProps 
}