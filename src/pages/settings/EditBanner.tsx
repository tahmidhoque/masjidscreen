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
import SettingsWrapper from "../../components/SettingsWrapper";

export default function EditBanner(): JSX.Element {
	const { state } = useAppState();
	const rteRef = useRef<RichTextEditorRef>(null);

	const handleSave = async () => {
		const db = new DatabaseHandler();
		const encoder = new TextEncoder();

		const content = rteRef.current?.editor?.getHTML();
		if (!content) return;
		const encodedContent = encoder.encode(content);
		await db.setBanner(encodedContent);
	};

	return (
		<SettingsWrapper
			header="Edit Banner"
			subText="Edit the banner message here. You can use the toolbar to format the text."
		>
			{state.bannerMessage && (
				<RichTextEditor
					ref={rteRef}
					extensions={[StarterKit, TextAlign, Color, TextStyle]} // Or any Tiptap extensions you wish!
					content={`${state.bannerMessage}`} // Initial content for the editor
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
		</SettingsWrapper>
	);
}
