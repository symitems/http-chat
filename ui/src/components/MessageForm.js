import { forwardRef } from 'react';
import '../App.css';
import { Button, Fab, Grid } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import SendIcon from '@mui/icons-material/Send';
import ImageUploadButtom from '../components/ImageUploadButtom';

export default forwardRef((props, ref) => {
    return (
        <div>
            <div>
                <table cellPadding={5}>
                    <tbody>
                        <tr>
                            <td>
                                <textarea
                                    style={{ fontSize: "16px" }}
                                    ref={ref}
                                    cols="25"
                                    rows="4"
                                    onChange={props.onChange}
                                    onKeyDown={props.onKeyDown}
                                    required
                                />
                            </td>
                            <td>
                                <Fab variant="contained" component="span" size="small" onClick={props.onClickSubmit}>
                                    <SendIcon fontSize="small" />
                                </Fab>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <hr></hr>
            </div>
            <Grid
                container
                direction="row"
                justifyContent="space-around"
                alignItems="center"
            >
                <ImageUploadButtom />
                <Fab variant="contained" component="span" size="small" onClick={props.onClickClearAll}>
                    <ClearIcon fontSize="small" />
                </Fab>
            </Grid>
        </div >
    )
})
