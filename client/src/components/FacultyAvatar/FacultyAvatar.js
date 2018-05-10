import Avatar from "material-ui/Avatar";
import React, { Component } from "react";


export default class FacultyAvatar extends Component {
    render() {
        const name = this.props.faculty.user.name;
        //TODO: Show photo if present
        return (
            <Avatar className={this.props.className}>{name.first[0]}{name.last[0]}</Avatar>
        );
    }
}