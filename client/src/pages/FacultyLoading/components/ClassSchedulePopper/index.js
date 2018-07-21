import {
    MEETING_DAYS,
    MEETING_HOURS,
    TERM_STATUSES,
} from "../../../../enums/class.enums";
import React, { Component, Fragment } from "react";

import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import { ClassScheduleModal } from "../modals/ClassScheduleModal";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Collapse from "@material-ui/core/Collapse";
import { CompatibilityDisplay } from "../CompatibilityDisplay";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { FacultyChip } from "../../../../components/FacultyChip";
import Grid from "@material-ui/core/Grid";
import Grow from "@material-ui/core/Grow";
import IconButton from "@material-ui/core/IconButton";
import OpenInNewIcon from "@material-ui/icons/OpenInNew";
import Popper from "@material-ui/core/Popper";
import { RemoveClassScheduleModal } from "../modals/RemoveClassScheduleModal";
import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";
import { makeURL } from "../../../../utils/url.util";
import { wrap } from "./wrapper";

class BaseClassSchedulePopper extends Component {
    state = {
        removeClassScheduleModalIsShowing: false,
        updateClassScheduleModalIsShowing: false,
        expanded: false,
    };

    handleExpandClick = shouldShow =>
        this.setState({
            expanded: shouldShow,
        });

    toggleRemoveClassScheduleModal = shouldShow =>
        this.setState({
            removeClassScheduleModalIsShowing: shouldShow,
        });

    toggleUpdateClassScheduleModal = shouldShow =>
        this.setState({
            updateClassScheduleModalIsShowing: shouldShow,
        });

    renderButtons = () => (
        <Grid container justify="space-between" alignItems="flex-end">
            <Grid item>
                <Button
                    color="primary"
                    onClick={() => this.toggleUpdateClassScheduleModal(true)}
                >
                    Update class
                </Button>
            </Grid>
            {this.shouldShowRemoveTermSchedule && (
                <Grid item>
                    <Button
                        color="primary"
                        onClick={() =>
                            this.toggleRemoveClassScheduleModal(true)
                        }
                    >
                        Remove class
                    </Button>
                </Grid>
            )}
        </Grid>
    );

    renderOverview = () => {
        const { subject, classSchedule, history } = this.props;

        const onSubjectClick = () =>
            history.push(
                makeURL()
                    .subjects()
                    .selectSubject(subject._id)
                    .build()
            );

        return (
            <Grid
                container
                direction="row"
                justify="space-between"
                wrap="nowrap"
            >
                <Grid item xs>
                    <Typography variant="subheading">
                        {subject.name}{" "}
                    </Typography>
                    <Typography color="textSecondary">
                        {classSchedule.course}
                    </Typography>
                    <Typography color="textSecondary">
                        {classSchedule.section}
                    </Typography>
                </Grid>
                <Grid item>
                    <Tooltip disableFocusListener title="View subject">
                        <IconButton
                            aria-label="View subject"
                            onClick={onSubjectClick}
                        >
                            <OpenInNewIcon />
                        </IconButton>
                    </Tooltip>
                </Grid>
            </Grid>
        );
    };

    renderSchedule = () => {
        const {
            classSchedule: { meetingHours, meetingDays },
        } = this.props;

        const meetingDaysName = MEETING_DAYS[meetingDays].name;
        const meetingHoursName = MEETING_HOURS[meetingHours].name;

        return (
            <Fragment>
                <Typography>{meetingDaysName}</Typography>
                <Typography>{meetingHoursName}</Typography>
            </Fragment>
        );
    };

    renderFaculty = () => {
        const {
            user,
            classes,
            faculty,
            onRemoveFacultyFromClassSchedule,
            termSchedule,
            classSchedule,
        } = this.props;

        const { expanded } = this.state;

        if (!faculty) {
            return (
                <Typography color="textSecondary">
                    No assigned faculty
                </Typography>
            );
        }

        const iconButtonClasses = [classes.expand];

        if (expanded) {
            iconButtonClasses.push(classes.expandOpen);
        }

        return (
            <Grid
                container
                direction="row"
                alignItems="center"
                justify="space-between"
            >
                <Grid item xs>
                    <div className={classes.facultyChipWrapper}>
                        <FacultyChip
                            clickable
                            faculty={faculty}
                            showDeleteButton={
                                this.termStatusAllowsMutation &&
                                user.permissions.MUTATE_TERM_SCHEDULES
                            }
                            handleDelete={() =>
                                onRemoveFacultyFromClassSchedule(
                                    termSchedule,
                                    classSchedule
                                )
                            }
                        />
                    </div>
                </Grid>
                <Grid item>
                    <IconButton
                        className={iconButtonClasses.join(" ")}
                        onClick={() => this.handleExpandClick(!expanded)}
                        aria-expanded={expanded}
                    >
                        <ExpandMoreIcon />
                    </IconButton>
                </Grid>
            </Grid>
        );
    };

    renderCompatibility = () => {
        const { compatibility } = this.props;
        const { expanded } = this.state;

        return (
            <Collapse in={expanded} timeout="auto">
                <CompatibilityDisplay compatibility={compatibility} />
            </Collapse>
        );
    };

    get shouldShowRemoveTermSchedule() {
        const { termSchedule } = this.props;
        return termSchedule.status === TERM_STATUSES.INITIALIZING.identifier;
    }

    get termStatusAllowsMutation() {
        const { termSchedule } = this.props;
        return [
            TERM_STATUSES.INITIALIZING.identifier,
            TERM_STATUSES.SCHEDULING.identifier,
        ].includes(termSchedule.status);
    }

    renderPopperContent = () => {
        const {
            classSchedule,
            subject,
            termSchedule,
            compatibility,
            user,
        } = this.props;

        const {
            removeClassScheduleModalIsShowing,
            updateClassScheduleModalIsShowing,
        } = this.state;

        return (
            <Fragment>
                <CardContent>
                    <Grid
                        container
                        spacing={24}
                        direction="column"
                        alignItems="stretch"
                        wrap="nowrap"
                    >
                        <Grid item>{this.renderOverview()}</Grid>
                        <Grid item>{this.renderSchedule()}</Grid>
                        <Grid item>{this.renderFaculty()}</Grid>
                    </Grid>
                </CardContent>

                {compatibility && this.renderCompatibility()}

                {this.termStatusAllowsMutation &&
                    user.permissions.POPULATE_TERM_SCHEDULES && (
                        <CardActions>{this.renderButtons()}</CardActions>
                    )}

                {this.shouldShowRemoveTermSchedule && (
                    <RemoveClassScheduleModal
                        open={removeClassScheduleModalIsShowing}
                        onClose={() =>
                            this.toggleRemoveClassScheduleModal(false)
                        }
                        classSchedule={classSchedule}
                        termSchedule={termSchedule}
                        subject={subject}
                    />
                )}

                {this.termStatusAllowsMutation &&
                    user.permissions.POPULATE_TERM_SCHEDULES && (
                        <ClassScheduleModal
                            action="update"
                            open={updateClassScheduleModalIsShowing}
                            onClose={() =>
                                this.toggleUpdateClassScheduleModal(false)
                            }
                            classSchedule={classSchedule}
                            termSchedule={termSchedule}
                        />
                    )}
            </Fragment>
        );
    };

    render() {
        const { classes, open, anchorEl, onClose } = this.props;
        return (
            <Popper
                open={open}
                anchorEl={anchorEl}
                placement="right"
                transition
            >
                {({ TransitionProps }) => (
                    <Grow {...TransitionProps} timeout={250}>
                        <Card className={classes.popperContainer}>
                            <ClickAwayListener
                                onClickAway={() => {
                                    console.log("Clicked away");
                                    onClose();
                                }}
                            >
                                {this.renderPopperContent()}
                            </ClickAwayListener>
                        </Card>
                    </Grow>
                )}
            </Popper>
        );
    }
}

export const ClassSchedulePopper = wrap(BaseClassSchedulePopper);