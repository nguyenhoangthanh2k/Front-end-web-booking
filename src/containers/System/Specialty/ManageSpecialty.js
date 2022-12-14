import React, { Component } from 'react';
import { connect } from 'react-redux';
import './ManageSpecialty.scss';
import { FormattedMessage } from 'react-intl';
import { createNewSpecialty } from '../../../services/userService'
import { toast } from 'react-toastify';
import { CommonUtils } from '../../../utils'
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';


const mdParser = new MarkdownIt();

class MangeSpecialty extends Component {
    constructor(props) {
        super(props);

        this.state = {
            name: '',
            imageBase64: '',
            descriptionHTML: '',
            descriptionMarkdown: '',
        }
    }

    componentDidMount() {

    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.allDoctors !== this.props.allDoctors) {
            let dataSelect = this.buildDataInputSelect(this.props.allDoctors)
            this.setState({
                listDoctors: dataSelect
            })
        }
        if (prevProps.allScheduleTime !== this.props.allScheduleTime) {
            let data = this.props.allScheduleTime;
            if (data && data.length > 0) {
                data = data.map(item => ({ ...item, isSelected: false }))
            }
            this.setState({
                rangeTime: data
            })
        }
    }

    handleOnchangeInput = (event, id) => {
        let valueInput = event.target.value;
        let stateCopy = { ...this.state };
        stateCopy[id] = valueInput;
        this.setState({
            ...stateCopy
        })
    }

    handleEditorChange = ({ html, text }) => {

        this.setState({
            descriptionMarkdown: text,
            descriptionHTML: html,
        })
    }

    handleOnchangeImage = async (event) => {
        let data = event.target.files;
        let file = data[0];

        if (file) {
            let base64 = await CommonUtils.getBase64(file)
            let objectUrl = URL.createObjectURL(file);
            this.setState({
                imageBase64: base64
            })
        }
    }

    handleSaveNewSpecialty = async () => {
        let res = await createNewSpecialty(this.state);
        if (res && res.errCode === 0) {
            toast.success('Add new spcialty succeeds!');
            this.setState({
                name: '',
                imageBase64: '',
                descriptionHTML: '',
                descriptionMarkdown: '',
            })
        } else {
            toast.error('Something wrongs...')
            console.log('check res of save new specialty', res);
        }
    }



    render() {

        return (
            <div className='manage-specialty-container'>
                <div className='ms-title'>
                    <FormattedMessage id="manage-schedule.title" />
                </div>

                <div className='add-new-specialty row'>
                    <div className='col-6 form-group'>
                        <label> ten chuyen khoa <FormattedMessage id="manage-schedule.choose-doctor" /></label>
                        <input className='form-control' type='text' value={this.state.name}
                            onChange={(event) => this.handleOnchangeInput(event, 'name')}
                        />
                    </div>

                    <div className='col-6 form-group'>
                        <label>anh chuyen khoa <FormattedMessage id="manage-schedule.choose-date" /></label>
                        <input className='form-control file-input' type='file'
                            onChange={(event) => this.handleOnchangeImage(event)}
                        />
                    </div>

                    <div className='col-12'>
                        <MdEditor
                            style={{ height: '500px' }}
                            renderHTML={text => mdParser.render(text)}
                            onChange={this.handleEditorChange}
                            value={this.state.descriptionMarkdown}
                        />
                    </div>
                    <div className='col-12'>
                        <button className='btn-save-specialty'
                            onClick={() => this.handleSaveNewSpecialty()}
                        >
                            <FormattedMessage id="manage-schedule.save" />
                        </button>
                    </div>
                </div>
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {
        language: state.app.language,
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(MangeSpecialty);
