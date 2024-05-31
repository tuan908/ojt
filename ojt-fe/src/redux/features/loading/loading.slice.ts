import {createAppSlice} from "../../configs/base-slice.config";

type LoadingState = {isLoading: boolean};

const initialState: LoadingState = {isLoading: false};

export const loadingSlice = createAppSlice({
    name: "LOADING",
    initialState,
    reducers: create => ({
        showLoading: create.asyncThunk(
            async (_arg: void) => {
                return true;
            },
            {
                settled: state => {
                    state.isLoading = true;
                },
            }
        ),
        hideLoading: create.asyncThunk(
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
        getLoadingState: state => state.isLoading,
    },
});

export const {
    actions: {showLoading, hideLoading},
    selectors: {getLoadingState},
} = loadingSlice;
