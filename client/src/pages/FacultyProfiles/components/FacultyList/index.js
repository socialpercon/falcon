import { compose } from "recompose";
import { connect } from "react-redux";
import { withTheme, withStyles } from "material-ui/styles";
import { setFaculties, startLoading, setErrors, setActiveFaculty } from "../../../../actions/faculty_list.actions";

import style from "./styles";
import FacultyList from "./FacultyList";
import { getAllFacultiesOverview } from "../../../../services/faculty.service";

function mapStateToProps(state) {
    return {
        isLoading: state.facultyList.isLoading,
        faculties: state.facultyList.faculties,
        errors: state.facultyList.errors,
        activeFaculty: state.facultyList.activeFaculty,
        searchKeyword: state.facultyList.searchKeyword,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        fetchData() {
            dispatch(startLoading());

            getAllFacultiesOverview()
                .then(query => {
                    if (query.data) {
                        dispatch(setFaculties(query.data.faculties));
                    }

                    if (query.errors) {
                        dispatch(setErrors(query.errors));
                    }
                })
                .catch(error => {
                    dispatch(setErrors([error.message]));
                });
        },

        onFacultyClick(faculty) {
            dispatch(setActiveFaculty(faculty));
        },
    };
}


export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    withTheme(),
    withStyles(style),
)(FacultyList);