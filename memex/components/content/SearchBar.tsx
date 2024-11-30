import { Input, Modal } from "antd";
import { useState } from "react";

export function SearchBar() {
    const [visible, setVisible] = useState(false);


    const handleOpenModal = () => {
        setVisible(true);
    };

    const handleCloseModal = () => {
        setVisible(false);
    };

    return (
        <>
            <button onClick={handleOpenModal}>Open Search</button>
            <Modal
                title="Search"
                open={visible}
                onCancel={handleCloseModal}
                footer={null}
            >
                <Input placeholder="Enter your search query" />
            </Modal>
        </>
    );
}