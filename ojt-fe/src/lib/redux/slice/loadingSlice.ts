import {createAppSlice} from "../baseSlice";

type LoadingState = {isLoading: boolean};

const initialState: LoadingState = {isLoading: false};

export const loadingSlice = createAppSlice({
    name: "LOADING",
    initialState,
    reducers: create => ({
        showIsLoadingOrFetching: create.asyncThunk(
            async (_arg: void) => {
                return true;
            },
            {
                settled: state => {
                    state.isLoading = true;
                },
            }
        ),
        hideIsLoadingOrFetching: create.asyncThunk(
            async (_arg: void) => {
                return false;
            },
            {
                settled: state => {
                    state.isLoading = false;
                },
            }
        ),
    }),

    selectors: {
        getLoadingOrFetchingState: state => state.isLoading,
    },
});

export const {
    actions: {hideIsLoadingOrFetching, showIsLoadingOrFetching},
    selectors: {getLoadingOrFetchingState},
} = loadingSlice;
