"use client";

import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { fetchNoteById } from "@/lib/api/clientApi";
import Modal from "@/components/Modal/Modal";
import css from "@/components/NotePreview/NotePreview.module.css";

interface NotePreviewProps {
    id: string;
}

export default function NotePreview({ id }: NotePreviewProps) {
    const router = useRouter();

    const {
        data: note,
        isLoading,
        isError,
    } = useQuery({
        queryKey: ["note", id],
        queryFn: () => fetchNoteById(id),
        refetchOnMount: false,
    });

    const handleClose = () => {
        router.back();
    };

    if (isLoading) {
        return (
            <Modal onClose={handleClose}>
                <p>Loading...</p>
            </Modal>
        );
    }

    if (isError || !note) {
        return (
            <Modal onClose={handleClose}>
                <p>Something went wrong.</p>
            </Modal>
        );
    }

    return (
        <Modal onClose={handleClose}>
            <div className={css.container}>
                <div className={css.item}>
                    <div className={css.header}>
                        <h2>{note.title}</h2>
                    </div>
                    <p className={css.tag}>{note.tag}</p>
                    <p className={css.content}>{note.content}</p>
                    <p className={css.date}>{note.createdAt}</p>
                    <button className={css.backBtn} onClick={handleClose}>
                        Close
                    </button>
                </div>
            </div>
        </Modal>
    );
}
