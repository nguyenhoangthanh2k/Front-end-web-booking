import actionTypes from '../actions/actionTypes';

const initialState = {
    isLoadingGender: false,
    isLoadingPosition: false,
    isLoadingRole: false,
    genders: [],
    roles: [],
    positions: [],
    users: [],
    topDoctors: [],
    allDoctors: [],
    allScheduleTime: [],
    allRequiredDoctorInfor: [],
}

const adminReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.FETCH_GENDER_START:
            {
                let copyState = { ...state };
                copyState.isLoadingGender = true;
                return {
                    ...copyState,
                }
            }

        case actionTypes.FETCH_GENDER_SUCCESS:
            {
                let copyState = { ...state };
                copyState.genders = action.data
                copyState.isLoadingGender = false;
                console.log('fire reducer success', action);
                return {
                    ...copyState,
                }
            }

        case actionTypes.FETCH_GENDER_FAILED:
            {
                let copyState = { ...state };
                copyState.isLoadingPosition = false;
                console.log('fire reducer faild', action);
                return {
                    ...state,
                }
            }

        // POSITION
        case actionTypes.FETCH_POSITION_START:
            {
                let copyState = { ...state };
                copyState.isLoadingPosition = true;
                return {
                    ...copyState,
                }
            }

        case actionTypes.FETCH_POSITION_SUCCESS:
            {
                let copyState = { ...state };
                copyState.positions = action.data
                copyState.isLoadingPosition = false;
                return {
                    ...copyState,
                }
            }

        case actionTypes.FETCH_POSITION_FAILED:
            {
                let copyState = { ...state };
                copyState.isLoadingPosition = false;
                return {
                    ...state,
                }
            }

        // ROLE
        case actionTypes.FETCH_ROLE_START:
            {
                let copyState = { ...state };
                copyState.isLoadingRole = true;
                return {
                    ...copyState,
                }
            }

        case actionTypes.FETCH_ROLE_SUCCESS:
            {
                let copyState = { ...state };
                copyState.roles = action.data
                copyState.isLoadingRole = false;
                return {
                    ...copyState,
                }
            }

        case actionTypes.FETCH_ROLE_FAILED:
            {
                let copyState = { ...state };
                copyState.isLoadingRole = false;
                return {
                    ...state,
                }
            }

        case actionTypes.FETCH_ALL_USERS_SUCCESS:
            {
                state.users = action.users;
                console.log('check action', action);

                return {
                    ...state
                }
            }

        case actionTypes.FETCH_ALL_USERS_FAILED:
            {
                state.users = []
                console.log('check action', action);

                return {
                    ...state
                }
            }

        case actionTypes.FETCH_TOP_DOCTORS_SUCCESS:
            {
                state.topDoctors = action.dataDoctors;
                return {
                    ...state
                }
            }

        case actionTypes.FETCH_TOP_DOCTORS_FAILED:
            {
                state.topDoctors = []

                return {
                    ...state
                }
            }
        case actionTypes.FETCH_ALL_DOCTORS_SUCCESS:
            {
                state.allDoctors = action.dataDr;
                return {
                    ...state
                }
            }

        case actionTypes.FETCH_ALL_DOCTORS_FAILED:
            {
                state.allDoctors = []

                return {
                    ...state
                }
            }
        case actionTypes.FETCH_ALLCODE_SCHEDULE_TIME_SUCCESS:
            {
                state.allScheduleTime = action.dataTime;
                return {
                    ...state
                }
            }

        case actionTypes.FETCH_ALLCODE_SCHEDULE_TIME_FAILED:
            {
                state.allScheduleTime = []

                return {
                    ...state
                }
            }
        case actionTypes.FETCH_REQUIRED_DOCTOR_SUCCESS:
            {
                state.allRequiredDoctorInfor = action.data;
                return {
                    ...state
                }
            }

        case actionTypes.FETCH_REQUIRED_DOCTOR_FAILED:
            {
                state.allRequiredDoctorInfor = []

                return {
                    ...state
                }
            }


        default:
            return state;
    }
}

export default adminReducer;