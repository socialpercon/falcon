import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import React, { Component } from "react";
import DetailCard from "../../../../../components/DetailCard";
import EmptyState from "../../../../../components/states/EmptyState";
import TableRowActions from "../../../../../components/TableRowActions";
import TableToolbar from "../../../../../components/TableToolbar";
import { RECOGNITION } from "../../../../../enums/faculty.enums";
import { formatMonthYearDate } from "../../../../../utils/faculty";
import { getFullName } from "../../../../../utils/user";
import RecognitionModal from "../../modals/RecognitionModal";


class RecognitionRow extends Component {
    render() {
        const {recognition, onRemoveButtonClick, onUpdateButtonClick} = this.props;
        return (
            <TableRow>
                <TableCell>{recognition.title}</TableCell>
                <TableCell>{RECOGNITION.BASIS[recognition.basis].name}</TableCell>
                <TableCell>{recognition.sponsor}</TableCell>
                <TableCell>{formatMonthYearDate(recognition.date)}</TableCell>
                <TableRowActions removeButtonTooltipTitle="Remove this recognition"
                                 updateButtonTooltipTitle="Update this recognition"
                                 onRemoveButtonClick={onRemoveButtonClick}
                                 onUpdateButtonClick={onUpdateButtonClick} />
            </TableRow>
        );
    }
}

export default class RecognitionsCard extends Component {
    state = {
        recognitionModalIsShowing: false,
        activeRecognition: null,
    };

    toggleRecognitionModal = shouldShow => this.setState({
        recognitionModalIsShowing: shouldShow,
    });

    renderRows = recognitions => recognitions.map(recognition =>
        <RecognitionRow recognition={recognition} key={recognition._id}
                        onUpdateButtonClick={() => {
                            this.setState({
                                activeRecognition: recognition,
                            });

                            this.toggleRecognitionModal(true);
                        }}
                        onRemoveButtonClick={() => {
                            this.setState({
                                activeRecognition: recognition,
                            });

                            //TODO: Show remove modal
                        }}
        />,
    );

    renderEmptyState = () => (
        <EmptyState bigMessage={`${getFullName(this.props.faculty.user)} does not have recorded recognitions.`}
                    smallMessage="Recognitions added will be shown here."
                    onAddButtonClick={this.onAddButtonClick}
                    addButtonText="Add a recognition" />
    );

    onAddButtonClick = () => {
        this.toggleRecognitionModal(true);
    };

    render() {
        const faculty = this.props.faculty;
        //TODO: Sort by date
        const recognitions = faculty.recognitions;
        const recognitionsIsEmpty = recognitions.length === 0;

        const {recognitionModalIsShowing, activeRecognition} = this.state;

        return (
            <DetailCard>
                <TableToolbar tableTitle="Recognitions"
                              addButtonTooltipTitle="Add a recognition"
                              onAddButtonClick={this.onAddButtonClick} />
                {!recognitionsIsEmpty &&
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Title</TableCell>
                            <TableCell>Basis</TableCell>
                            <TableCell>Sponsor</TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {this.renderRows(recognitions)}
                    </TableBody>
                </Table>
                }

                {recognitionsIsEmpty && this.renderEmptyState()}


                <RecognitionModal
                    action={activeRecognition ? "update" : "add"}
                    recognition={activeRecognition}
                    faculty={faculty}
                    open={recognitionModalIsShowing}
                    onClose={() => this.toggleRecognitionModal(false)}
                />
            </DetailCard>
        );
    }
}
