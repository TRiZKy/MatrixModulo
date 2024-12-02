import React, { useState } from "react";
import {
    Box,
    Container,
    Typography,
    Grid,
    TextField,
    Button,
    Paper,
    ToggleButtonGroup,
    ToggleButton,
    Alert,
} from "@mui/material";

const App = () => {
    const [matrixADim, setMatrixADim] = useState("2x2");
    const [matrixBDim, setMatrixBDim] = useState("2x1");
    const [matrixA, setMatrixA] = useState([
        [1, 2],
        [3, 4],
    ]);
    const [matrixB, setMatrixB] = useState([
        [5],
        [6],
    ]);
    const [modulo, setModulo] = useState(7);
    const [result, setResult] = useState([]);
    const [error, setError] = useState("");

    const updateMatrixDimensions = (matrixSetter, dimension) => {
        const [rows, cols] = dimension.split("x").map(Number);
        matrixSetter(
            Array.from({ length: rows }, () => Array.from({ length: cols }, () => 0))
        );
    };

    const handleMatrixInput = (matrix, setMatrix, row, col, value) => {
        const updatedMatrix = [...matrix];
        updatedMatrix[row][col] = value === "" ? "" : parseInt(value, 10);
        setMatrix(updatedMatrix);
    };

    const handleCalculate = () => {
        const modMult = (A, B, mod) => {
            const rowsA = A.length,
                colsA = A[0].length,
                rowsB = B.length,
                colsB = B[0].length;

            if (colsA !== rowsB) {
                throw new Error(
                    `Invalid matrix multiplication: A is ${rowsA}x${colsA}, B is ${rowsB}x${colsB}.`
                );
            }

            const result = Array(rowsA)
                .fill(0)
                .map(() => Array(colsB).fill(0));

            for (let i = 0; i < rowsA; i++) {
                for (let j = 0; j < colsB; j++) {
                    for (let k = 0; k < colsA; k++) {
                        result[i][j] += A[i][k] * B[k][j];
                    }
                    result[i][j] %= mod;
                }
            }
            return result;
        };

        try {
            setError(""); // Reset error
            const output = modMult(matrixA, matrixB, modulo);
            setResult(output);
        } catch (err) {
            setError(err.message);
            setResult([]);
        }
    };

    const renderMatrix = (matrix, setMatrix) => (
        <Grid container spacing={1}>
            {matrix.map((row, rowIndex) =>
                row.map((value, colIndex) => (
                    <Grid item xs={12 / matrix[0].length} key={`${rowIndex}-${colIndex}`}>
                        <TextField
                            type="number"
                            value={value}
                            onChange={(e) =>
                                handleMatrixInput(matrix, setMatrix, rowIndex, colIndex, e.target.value)
                            }
                            fullWidth
                            variant="outlined"
                            inputProps={{
                                style: {
                                    textAlign: "center",
                                    padding: "10px",
                                    fontSize: "1rem",
                                },
                            }}
                        />
                    </Grid>
                ))
            )}
        </Grid>
    );

    return (
        <Container maxWidth="lg">
            <Box
                sx={{
                    bgcolor: "#f4f4f9",
                    padding: "2rem",
                    borderRadius: "8px",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                }}
            >
                <Typography
                    variant="h4"
                    gutterBottom
                    sx={{ textAlign: "center", fontWeight: "bold" }}
                >
                    Matrix Multiplication with Modulo
                </Typography>
                <Grid container spacing={4}>
                    {/* Matrix A */}
                    <Grid item xs={12} sm={6}>
                        <Paper elevation={3} sx={{ padding: "1rem" }}>
                            <Typography variant="h6" gutterBottom>
                                Matrix A
                            </Typography>
                            <ToggleButtonGroup
                                value={matrixADim}
                                exclusive
                                onChange={(e, value) => {
                                    if (value) {
                                        setMatrixADim(value);
                                        updateMatrixDimensions(setMatrixA, value);
                                    }
                                }}
                                sx={{ marginBottom: "1rem" }}
                            >
                                <ToggleButton value="2x2">2x2</ToggleButton>
                                <ToggleButton value="1x2">1x2</ToggleButton>
                            </ToggleButtonGroup>
                            {renderMatrix(matrixA, setMatrixA)}
                        </Paper>
                    </Grid>
                    {/* Matrix B */}
                    <Grid item xs={12} sm={6}>
                        <Paper elevation={3} sx={{ padding: "1rem" }}>
                            <Typography variant="h6" gutterBottom>
                                Matrix B
                            </Typography>
                            <ToggleButtonGroup
                                value={matrixBDim}
                                exclusive
                                onChange={(e, value) => {
                                    if (value) {
                                        setMatrixBDim(value);
                                        updateMatrixDimensions(setMatrixB, value);
                                    }
                                }}
                                sx={{ marginBottom: "1rem" }}
                            >
                                <ToggleButton value="2x2">2x2</ToggleButton>
                                <ToggleButton value="2x1">2x1</ToggleButton>
                            </ToggleButtonGroup>
                            {renderMatrix(matrixB, setMatrixB)}
                        </Paper>
                    </Grid>
                </Grid>
                {/* Modulo Input */}
                <Box sx={{ marginY: "2rem" }}>
                    <Typography variant="h6" gutterBottom>
                        Modulo Value
                    </Typography>
                    <TextField
                        type="number"
                        fullWidth
                        variant="outlined"
                        value={modulo}
                        onChange={(e) => setModulo(Number(e.target.value))}
                    />
                </Box>
                {/* Calculate Button */}
                <Box sx={{ textAlign: "center", marginY: "1rem" }}>
                    <Button
                        variant="contained"
                        size="large"
                        onClick={handleCalculate}
                        sx={{ bgcolor: "#6200ea", color: "#fff" }}
                    >
                        Calculate
                    </Button>
                </Box>
                {/* Error Display */}
                {error && (
                    <Alert severity="error" sx={{ marginBottom: "1rem" }}>
                        {error}
                    </Alert>
                )}
                {/* Result */}
                {result.length > 0 && (
                    <Box>
                        <Typography variant="h5" gutterBottom>
                            Result:
                        </Typography>
                        <Paper
                            elevation={3}
                            sx={{
                                padding: "1rem",
                                bgcolor: "#e0f7fa",
                                borderRadius: "8px",
                                textAlign: "center",
                            }}
                        >
                            {renderMatrix(result, () => {})}
                        </Paper>
                    </Box>
                )}
            </Box>
        </Container>
    );
};

export default App;
