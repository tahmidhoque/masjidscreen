import { Box, Button } from "@mui/material";
import {
	DataGrid,
	GridActionsCellItem,
	GridColDef,
	GridEventListener,
	GridPagination,
	GridRowEditStopReasons,
	GridRowId,
	GridRowModel,
	GridRowModes,
	GridRowModesModel,
	GridRowsProp,
	GridSlotsComponentsProps,
	GridToolbarContainer,
} from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { useAppState } from "../providers/state";
import { randomId } from "@mui/x-data-grid-generator";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import DatabaseHandler from "../modules/DatabaseHandler";
import { useGridApiRef } from "@mui/x-data-grid";

const timeWidth = 60;

interface EditToolbarProps {
	setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void;
	setRowModesModel: (
		newModel: (oldModel: GridRowModesModel) => GridRowModesModel
	) => void;
}

function EditToolbar(props: EditToolbarProps) {
	const { setRows, setRowModesModel } = props;

	const handleClick = () => {
		const id = randomId();
		setRows((oldRows) => [
			...oldRows,
			{
				id,
				Date: "",
				Fajr: "",
				Sunrise: "",
				Zuhr: "",
				Asr: "",
				Maghrib: "",
				Isha: "",
				"Fajr J": "",
				"Zuhr J": "",
				"Asr J": "",
				"Maghrib J": "",
				"Isha J": "",
				Khutbah: "",
				"Khutbah J": "",
			},
		]);

		setRowModesModel((oldModel: any) => ({
			...oldModel,
			[id]: { mode: GridRowModes.Edit, fieldToFocus: "Date" },
		}));
	};

	return (
		<GridToolbarContainer>
			<Button color="secondary" startIcon={<AddIcon />} onClick={handleClick}>
				Add record
			</Button>
		</GridToolbarContainer>
	);
}

export default function EditingGrid() {
	const { state, setState } = useAppState();
	const [tableData, setTableData] = useState(state.timetableData);
	const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
	const apiRef = useGridApiRef();

	useEffect(() => {
		if (!state.timetableData) return;
		setTableData(state.timetableData);
	}, [state.timetableData]);

	const columns: GridColDef[] = [
		{ field: "Date", headerName: "Date", editable: true },
		{ field: "Fajr", headerName: "Fajr", editable: true },
		{ field: "Sunrise", headerName: "Sunrise", editable: true },
		{ field: "Zuhr", headerName: "Zuhr", editable: true },
		{ field: "Asr", headerName: "Asr", editable: true },
		{ field: "Maghrib", headerName: "Maghrib", editable: true },
		{ field: "Isha", headerName: "Isha", editable: true },
		{ field: "Fajr J", headerName: "Fajr Jamaat", editable: true },
		{ field: "Zuhr J", headerName: "Zuhr Jamaat", editable: true },
		{ field: "Asr J", headerName: "Asr Jamaat", editable: true },
		{
			field: "Maghrib J",
			headerName: "Maghrib Jamaat",
			minWidth: timeWidth + 20,
		},
		{ field: "Isha J", headerName: "Isha Jamaat", minWidth: timeWidth + 20 },
		{ field: "Khutbah", headerName: "Khutbah", minWidth: timeWidth + 20 },
		{
			field: "Khutbah J",
			headerName: "Khutbah Jamaat",
			minWidth: timeWidth + 20,
		},
		{
			field: "Actions",
			type: "actions",
			headerName: "Actions",
			width: 100,
			getActions: ({ id }) => {
				return [
					<GridActionsCellItem
						icon={<DeleteIcon />}
						label="Delete"
						onClick={handleDeleteClick(id)}
						color="inherit"
					/>,
				];
			},
		},
	];

	const convertData = (data: { [key: string]: any }): any[] => {
		return Object.keys(data).map(function (_) {
			return data[_];
		});
	};
	const CustomFooterStatusComponent = (
		props: NonNullable<GridSlotsComponentsProps["footer"]>
	) => {
		return (
			<Box sx={{ p: 1, display: "flex" }}>
				<Button
					color="secondary"
					variant="contained"
					onClick={() => {
						const rows = apiRef.current.state.rows.dataRowIdToModelLookup;
						const dataArray = convertData(rows);
						const db = new DatabaseHandler();
						db.setTimetable(dataArray);
						setState({ ...state, timetableData: tableData });
					}}
				>
					Save
				</Button>
				<GridPagination />
			</Box>
		);
	};

	const handleDeleteClick = (id: GridRowId) => () => {
		const removedRow = tableData.filter(
			(row: { id: GridRowId; Date: GridRowId }) => {
				console.log(id !== row.Date);
				console.log(row.id !== id || row.Date !== id);
				return row.id !== id || row.Date !== id;
			}
		);
		setTableData(removedRow);
	};

	const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
		setRowModesModel(newRowModesModel);
	};

	const handleRowEditStop: GridEventListener<"rowEditStop"> = (
		params,
		event
	) => {
		if (params.reason === GridRowEditStopReasons.rowFocusOut) {
			event.defaultMuiPrevented = true;
		}
	};

	const processRowUpdate = (newRow: GridRowModel) => {
		const updatedRow = { ...newRow, isNew: false };
		setTableData(
			tableData.map((row: { id: any }) =>
				row.id === newRow.id ? updatedRow : row
			)
		);
		return updatedRow;
	};

	return (
		<>
			{tableData && (
				<Box
					id={"editing-grid"}
					sx={{ maxWidth: "calc(100vw - 330px)", height: "60vh" }}
				>
					<DataGrid
						rows={tableData}
						apiRef={apiRef}
						onStateChange={(newState) => {
							const rows = newState.rows.dataRowIdToModelLookup;
							const dataArray = convertData(rows);
							setTableData(newState.rows);
						}}
						columns={columns}
						getRowId={(row) => {
							return row.id;
						}}
						editMode="row"
						rowModesModel={rowModesModel}
						onRowModesModelChange={handleRowModesModelChange}
						onRowEditStop={handleRowEditStop}
						processRowUpdate={processRowUpdate}
						slots={{
							footer: CustomFooterStatusComponent,
							toolbar: EditToolbar,
						}}
						slotProps={{
							toolbar: { setRows: setTableData, setRowModesModel },
						}}
						sx={{
							color: "black !important",
							boxShadow: 2,
							border: 2,
							borderColor: "primary.light",
							"& .MuiDataGrid-cell:hover": {
								fontWeight: "bold",
								color: "secondary.main",
							},
							backgroundColor: "white",
						}}
					/>
				</Box>
			)}
		</>
	);
}
