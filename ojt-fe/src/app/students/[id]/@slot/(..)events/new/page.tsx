import Form from "@/components/Form";
import {Modal} from "./modal";

export default function PhotoModal({
    params: {id: studentCode},
}: {
    params: {id: string};
}) {
    return (
        <Modal>
            {studentCode}
            <Form />
        </Modal>
    );
}
