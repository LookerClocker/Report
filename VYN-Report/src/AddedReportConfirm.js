import React, {Component} from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

export default class AddedReportConfirm extends Component {
    state = {
        open: true,
    };

    handleClose = () => {
        this.setState({open: false});
        location.href = '/';
    };

    render() {
        const actions = [
            <FlatButton
                label="OK"
                primary={true}
                keyboardFocused={true}
                onTouchTap={this.handleClose}
            />,
        ];

        return (
            <div>
                <Dialog
                    title="Success"
                    actions={actions}
                    modal={false}
                    open={this.state.open}
                    onRequestClose={this.handleClose}
                >
                    Reports {this.props.name} has been added successfully!
                </Dialog>
            </div>
        );
    }
}