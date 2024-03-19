import { Box, Grid, Typography } from "@mui/material";
import { Button } from "@mui/material";
import StarterKit from "@tiptap/starter-kit";
import {
	MenuButtonBold,
	MenuButtonItalic,
	MenuControlsContainer,
	MenuDivider,
	MenuSelectHeading,
	RichTextEditor,
	type RichTextEditorRef,
} from "mui-tiptap";
import { useRef } from "react";
import { useAppState } from "../../providers/state";

import "../../styles/wysiwyg.css";
import DatabaseHandler from "../../modules/DatabaseHandler";

export default function EditHadith(): JSX.Element {
	const { state } = useAppState();
	const rteRef = useRef<RichTextEditorRef>(null);

	const handleSave = async () => {
		const db = new DatabaseHandler();
		const encoder = new TextEncoder();

		const content = rteRef.current?.editor?.getHTML();
		if (!content) return;
		const encodedContent = encoder.encode(content);
		await db.setHadith(encodedContent);
	};

	return (
		<Grid container sx={{ display: "flex", justifyContent: "center" }}>
			<Grid item xs={12}>
				<Typography variant="h2">Edit Hadith</Typography>
			</Grid>
			<Grid item xs={9} sx={{ alignSelf: "center" }}>
				<RichTextEditor
					ref={rteRef}
					extensions={[StarterKit]} // Or any Tiptap extensions you wish!
					content={state.hadithOfTheDay} // Initial content for the editor
					// Optionally include `renderControls` for a menu-bar atop the editor:
					renderControls={() => (
						<MenuControlsContainer>
							<MenuSelectHeading />
							<MenuDivider />
							<MenuButtonBold />
							<MenuButtonItalic />
							<Button
								variant="contained"
								sx={{ marginLeft: "auto", marginRight: "10px" }}
								onClick={handleSave}
							>
								Save
							</Button>

							{/* Add more controls of your choosing here */}
						</MenuControlsContainer>
					)}
				/>
			</Grid>
			<Grid item xs={12} sx={{ display: "flex" }}>
				<Box sx={{ display: "flex", justifyContent: "center" }}>
					<Button
						variant="contained"
						onClick={() => {
							console.log(
								"rteRef.current?.getContent()",
								rteRef.current?.editor?.getHTML()
							);
						}}
					>
						Save
					</Button>
				</Box>
			</Grid>
		</Grid>
	);
}
