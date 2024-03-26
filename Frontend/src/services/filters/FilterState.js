import React from "react";
import FilterContext from "./FilterContext"

const FilterState = props => {

    const [state, dispatch] = React.useReducer(
        (prevState, action) => {
            switch (action.type) {

                case 'APPLY_FILTER':
                    return {
                        context_id: action.context_id,
                        context_name: action.context_name,
                        isFiltered: true
                    };
                case 'CLEAR_FILTER':
                    return {
                        context_id: null,
                        context_name: null,
                        isFiltered: false
                    };
            }
        },
        {
            context_id: null,
            context_name: null,
            isFiltered: false,
        }
    );

    const filterFunctions = React.useMemo(
        () => ({
            applyFilter: (context)=> {
                dispatch({ type: 'APPLY_FILTER', context_id: context.context_id, context_name: context.name })
            },
            clearFilter: () => {
                dispatch({ type: 'CLEAR_FILTER'})
            }
        }),
        []
    );

    return (
        <FilterContext.Provider
            value={{
                applyFilter: filterFunctions.applyFilter,
                clearFilter: filterFunctions.clearFilter,
                context_id: state.context_id,
                context_name: state.context_name,
                isFiltered: state.isFiltered,
            }}
        >
            {props.children}
        </FilterContext.Provider>
    )
}

export default FilterState;
