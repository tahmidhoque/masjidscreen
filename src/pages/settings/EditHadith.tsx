import { Box, Button, Divider, Typography } from "@mui/material";
import { Color } from "@tiptap/extension-color";
import TextAlign from "@tiptap/extension-text-align";
import TextStyle from "@tiptap/extension-text-style";
import StarterKit from "@tiptap/starter-kit";
import {
	MenuButtonAlignCenter,
	MenuButtonAlignJustify,
	MenuButtonAlignLeft,
	MenuButtonAlignRight,
	MenuButtonBold,
	MenuButtonIndent,
	MenuButtonItalic,
	MenuButtonRedo,
	MenuButtonTextColor,
	MenuButtonUndo,
	MenuButtonUnindent,
	MenuControlsContainer,
	MenuDivider,
	MenuSelectHeading,
	MenuSelectTextAlign,
	RichTextEditor,
	type RichTextEditorRef,
} from "mui-tiptap";
import { useRef } from "react";
import { useAppState } from "../../providers/state";

import DatabaseHandler from "../../modules/DatabaseHandler";
import "../../styles/wysiwyg.css";

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
		<Box
			sx={{
				display: "flex",
				backgroundImage:
					"linear-gradient(to bottom right, rgba(255,255,255,0.2), rgba(255,255,255,0));",
				backdropFilter: "blur(10px)",
				boxShadow: "10px 10px 10px rgba(30,30,30,0.5);",
				paddingX: "20px",
				paddingBottom: "0px",
				borderRadius: "10px",
				height: "100%",
				flexDirection: "column",
			}}
		>
			<Box sx={{ width: "100%", paddingTop: 5 }}>
				<Typography variant="h2">Edit Hadith</Typography>
				<Typography variant="body1">
					Edit the hadith of the day here. You can use the toolbar to format the
					text.
				</Typography>
			</Box>
			<Divider sx={{ margin: "10px 0", borderColor: "white", paddingTop: 1 }} />
			<Box sx={{ flexGrow: 1, paddingTop: 2, height: "calc(100% - 20px)" }}>
				<Box
					sx={{ color: "black", margin: "auto", height: "calc(100% - 20px)" }}
				>
					{state.hadithOfTheDay && (
						<RichTextEditor
							ref={rteRef}
							extensions={[StarterKit, TextAlign, Color, TextStyle]} // Or any Tiptap extensions you wish!
							content={`${state.hadithOfTheDay}`} // Initial content for the editor
							// Optionally include `renderControls` for a menu-bar atop the editor:
							renderControls={() => (
								<MenuControlsContainer>
									<MenuSelectHeading />
									<MenuDivider />
									<MenuButtonBold />
									<MenuButtonItalic />
									<MenuSelectTextAlign />
									<MenuButtonAlignCenter />
									<MenuButtonAlignJustify />
									<MenuButtonAlignLeft />
									<MenuButtonAlignRight />
									<MenuButtonIndent />
									<MenuButtonUnindent />
									<MenuButtonUndo />
									<MenuButtonRedo />
									<MenuButtonTextColor />
									<Button
										variant="contained"
										sx={{
											marginLeft: "auto",
											marginRight: "10px",
											backgroundColor: "secondary.main",
											color: "white",
											height: "100%",
										}}
										onClick={handleSave}
									>
										Save
									</Button>

									{/* Add more controls of your choosing here */}
								</MenuControlsContainer>
							)}
						/>
					)}
				</Box>
			</Box>
		</Box>
	);
}
