import { Block, AssetScheme, SignedParcel, Transaction } from "codechain-sdk/lib/core/classes";

export interface RootState {
    bestBlockNumber?: number;
    blocksByNumber: {
        [n: number]: Block;
    };
    blocksByHash: {
        [hash: string]: Block;
    };
    parcelByHash: {
        [hash: string]: SignedParcel;
    };
    transactionByHash: {
        [hash: string]: Transaction;
    }
    assetSchemeByAssetType: {
        [assetType: string]: AssetScheme;
    };
    transactionListByAssetType: {
        [assetType: string]: Transaction[];
    }
}

const initialState: RootState = {
    bestBlockNumber: undefined,
    blocksByNumber: {},
    blocksByHash: {},
    parcelByHash: {},
    assetSchemeByAssetType: {},
    transactionByHash: {},
    transactionListByAssetType: {}
};

interface BestBlockNumberAction {
    type: "BEST_BLOCK_NUMBER_ACTION";
    data: number;
}

interface CacheBlockAction {
    type: "CACHE_BLOCK";
    data: Block;
};

interface CacheParcelAction {
    type: "CACHE_PARCEL";
    data: SignedParcel;
};

interface CacheTransactionAction {
    type: "CACHE_TRANSACTION";
    data: Transaction;
}

interface CacheAssetSchemeAction {
    type: "CACHE_ASSET_SCHEME";
    data: {
        assetType: string;
        assetScheme: AssetScheme;
    };
}

interface CacheAssetTransactionListAction {
    type: "CACHE_ASSET_TRANSACTION_LIST";
    data: {
        assetType: string;
        transactionList: Transaction[];
    };
}


type Action = BestBlockNumberAction | CacheAssetSchemeAction | CacheBlockAction | CacheParcelAction | CacheTransactionAction | CacheAssetTransactionListAction;

export const rootReducer = (state = initialState, action: Action) => {
    if (action.type === "BEST_BLOCK_NUMBER_ACTION") {
        return { ...state, bestBlockNumber: action.data }
    } else if (action.type === "CACHE_BLOCK") {
        const { number: n, hash } = action.data as Block;
        const blocksByNumber = { ...state.blocksByNumber, [n]: action.data };
        const blocksByHash = { ...state.blocksByHash, [hash.value]: action.data };
        return { ...state, blocksByNumber, blocksByHash };
    } else if (action.type === "CACHE_PARCEL") {
        const parcel = action.data as SignedParcel;
        const parcelByHash = { ...state.parcelByHash, [parcel.hash().value]: parcel };
        return { ...state, parcelByHash };
    } else if (action.type === "CACHE_TRANSACTION") {
        const transaction = action.data as Transaction;
        const transactionByHash = { ...state.transactionByHash, [transaction.hash().value]: transaction };
        return { ...state, transactionByHash };
    } else if (action.type === "CACHE_ASSET_SCHEME") {
        const { assetType, assetScheme } = (action as CacheAssetSchemeAction).data;
        const assetSchemeByAssetType = { ...state.assetSchemeByAssetType, [assetType]: assetScheme };
        return { ...state, assetSchemeByAssetType };
    } else if (action.type === "CACHE_ASSET_TRANSACTION_LIST") {
        const { assetType, transactionList } = (action as CacheAssetTransactionListAction).data;
        const transactionListByAssetType = { ...state.transactionListByAssetType, [assetType]: transactionList };
        return { ...state, transactionListByAssetType };
    } else {
        return state;
    }
};
