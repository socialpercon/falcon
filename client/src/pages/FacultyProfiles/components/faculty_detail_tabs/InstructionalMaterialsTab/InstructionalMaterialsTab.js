import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import React, { Component } from "react";
import { DetailCard } from "../../../../../components/DetailCard";
import { DetailExpansionCard } from "../../../../../components/DetailExpansionCard";
import { DetailExpansionCardActions } from "../../../../../components/DetailExpansionCardActions";
import { FormDisplayExpansionPanelDetails } from "../../../../../components/FormDisplayExpansionPanelDetails";
import { FormDisplayListItem } from "../../../../../components/FormDisplayListItem";
import { EmptyState } from "../../../../../components/states/EmptyState";
import { TableToolbar } from "../../../../../components/TableToolbar";
import { INSTRUCTIONAL_MATERIAL } from "../../../../../enums/faculty.enums";
import { getFullName } from "../../../../../utils/user.util";
import { InstructionalMaterialModal } from "../../modals/InstructionalMaterialModal";
import { RemoveInstructionalMaterialModal } from "../../modals/RemoveInstructionalMaterialModal";


const InstructionalMaterialRow = ({instructionalMaterial, onRemoveButtonClick, onUpdateButtonClick}) => (
    <DetailExpansionCard>

        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>{instructionalMaterial.title}</Typography>
        </ExpansionPanelSummary>

        <FormDisplayExpansionPanelDetails>

            <FormDisplayListItem field="Medium"
                                 value={INSTRUCTIONAL_MATERIAL.MEDIUM[instructionalMaterial.medium].name} />
            <FormDisplayListItem field="Audience"
                                 value={INSTRUCTIONAL_MATERIAL.AUDIENCE[instructionalMaterial.audience].name} />
            <FormDisplayListItem field="Usage Year"
                                 value={instructionalMaterial.usageYear} />

            {/*Student exclusive stuff*/}
            {instructionalMaterial.audience === INSTRUCTIONAL_MATERIAL.AUDIENCE.STUDENT.identifier &&
            <FormDisplayListItem field="Student Level"
                                 value={instructionalMaterial.level} />
            }

            <DetailExpansionCardActions removeButtonTooltipTitle="Remove instructional material"
                                        updateButtonTooltipTitle="Update instructional material details"
                                        onRemoveButtonClick={onRemoveButtonClick}
                                        onUpdateButtonClick={onUpdateButtonClick} />

        </FormDisplayExpansionPanelDetails>
    </DetailExpansionCard>
);

export class InstructionalMaterialsTab extends Component {
    state = {
        instructionalMaterialModalIsShowing: false,
        activeInstructionalMaterial: null,
        removeInstructionalMaterialModalIsShowing: false,
    };

    toggleInstructionalMaterialModal = shouldShow => this.setState({
        instructionalMaterialModalIsShowing: shouldShow,
    });

    toggleRemoveInstructionalMaterialModal = shouldShow => this.setState({
        removeInstructionalMaterialModalIsShowing: shouldShow,
    });

    onAddButtonClick = () => this.setState({
        activeInstructionalMaterial: null,
        instructionalMaterialModalIsShowing: true,
    });

    renderRows = instructionalMaterials => instructionalMaterials.map(instructionalMaterial =>
        <InstructionalMaterialRow
            instructionalMaterial={instructionalMaterial}
            key={instructionalMaterial._id}

            onUpdateButtonClick={() => this.setState({
                activeInstructionalMaterial: instructionalMaterial,
                instructionalMaterialModalIsShowing: true,
            })}

            onRemoveButtonClick={() => this.setState({
                activeInstructionalMaterial: instructionalMaterial,
                removeInstructionalMaterialModalIsShowing: true,
            })}
        />,
    );

    renderEmptyState = () => (
        <EmptyState
            bigMessage={`${getFullName(this.props.faculty.user)} does not have recorded instructional materials`}
            smallMessage="Instructional materials added will be shown here"
            onAddButtonClick={this.onAddButtonClick}
            addButtonText="Add an instructional material" />
    );

    render() {
        const {faculty, classes} = this.props;
        const instructionalMaterials = faculty.instructionalMaterials;
        const instructionalMaterialsIsEmpty = instructionalMaterials.length === 0;

        const {
            activeInstructionalMaterial,
            instructionalMaterialModalIsShowing,
            removeInstructionalMaterialModalIsShowing,
        } = this.state;

        return (
            <div className={classes.expansionCardsContainer}>
                <DetailCard>
                    <TableToolbar tableTitle="Instructional Materials"
                                  addButtonTooltipTitle="Add an instructional material"
                                  onAddButtonClick={this.onAddButtonClick} />
                    {instructionalMaterialsIsEmpty && this.renderEmptyState()}
                </DetailCard>

                {!instructionalMaterialsIsEmpty && this.renderRows(instructionalMaterials)}

                {instructionalMaterialModalIsShowing &&
                <InstructionalMaterialModal
                    action={activeInstructionalMaterial ? "update" : "add"}
                    open={instructionalMaterialModalIsShowing}
                    onClose={() => this.toggleInstructionalMaterialModal(false)}
                    instructionalMaterial={activeInstructionalMaterial}
                    faculty={faculty}
                />
                }

                {removeInstructionalMaterialModalIsShowing &&
                <RemoveInstructionalMaterialModal
                    open={removeInstructionalMaterialModalIsShowing}
                    onClose={() => this.toggleRemoveInstructionalMaterialModal(false)}
                    instructionalMaterial={activeInstructionalMaterial}
                    faculty={faculty}
                />
                }
            </div>
        );
    }
}
