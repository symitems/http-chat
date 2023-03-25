import { forwardRef } from 'react';
import '../App.css';

export default forwardRef((props, ref) => {
    return (
        <div>
            <div>
                <table cellPadding={5}>
                    <tbody>
                        <tr>
                            <td valign="middle">Message:</td>
                            <td>
                                <textarea
                                    style={{ fontSize: "16px" }}
                                    ref={ref}
                                    cols="22"
                                    rows="5"
                                    onChange={props.onChange}
                                    onKeyDown={props.onKeyDown}
                                    required
                                />
                            </td>
                        </tr>
                    </tbody>
                </table>
                <button type="submit" onClick={props.onClickSubmit}>
                    <big>Submit</big>
                </button>
                <hr></hr>
            </div>
            <button type="submit" onClick={props.onClickClearAll}>
                <big>Clear All</big>
            </button>
        </div>
    )
})
