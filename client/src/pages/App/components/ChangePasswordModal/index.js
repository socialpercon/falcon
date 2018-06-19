import { withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import compose from "recompose/compose";
import { genericModalStyle } from "../../../../components/styles";
import { changePasswordSuccess } from "../../../../redux/actions/authentication.actions";
import { toastIsShowing } from "../../../../redux/actions/toast.actions";
import { ChangePasswordModal as Component } from "./ChangePasswordModal";


const mapDispatchToProps = dispatch => ({
    onChangePasswordSuccess() {
        dispatch(toastIsShowing("Password successfully changed"));
        dispatch(changePasswordSuccess());

        const user = JSON.parse(localStorage.user);
        user.temporaryPassword = false;
        localStorage.user = JSON.stringify(user);
    },
});

export const ChangePasswordModal = compose(
    connect(null, mapDispatchToProps),
    withStyles(genericModalStyle),
)(Component);