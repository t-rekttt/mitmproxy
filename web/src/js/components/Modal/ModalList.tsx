import * as React from "react";
import ModalLayout from "./ModalLayout";
import OptionContent from "./OptionModal";
import { useAppDispatch } from "../../ducks";
import * as modalAction from "../../ducks/ui/modal";

function OptionModal() {
    const dispatch = useAppDispatch();

    return (
        <ModalLayout
            open={true}
            onOpenChange={(open) => {
                if (!open) {
                    dispatch(modalAction.hideModal());
                }
            }}
        >
            <OptionContent />
        </ModalLayout>
    );
}

export default {
    OptionModal,
};
