import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
// import './TableManageUser.scss';
import * as actions from '../../../store/actions';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
// import style manually
import 'react-markdown-editor-lite/lib/index.css';
import './ManageDoctor.scss'
import Select from 'react-select';
import { fetchAllDoctor } from '../../../store/actions';
import { CRUD_ACTIONS, LANGUAGE } from '../../../utils';
import { getDetailInforDoctor } from '../../../services/userService';


const mdParser = new MarkdownIt(/* Markdown-it options */);


class ManageDoctor extends Component {

    constructor(props) {
        super(props);
        this.state = {
            contentMarkdown: '',
            contentHTML: '',
            selectedOption: '',
            description: '',
            listDoctors: [],
            hasOldData: false,

            // infor doctor
            listPrice: [],
            listPayment: [],
            listProvince: [],
            listClinic: [],
            listSpecialty: [],

            selectedPrice: '',
            selectedPayment: '',
            selectedProvince: '',
            selectedClinic: '',
            selectedSpecialty: '',


            addressClinic: '',
            nameClinic: '',
            note: '',
            clinicId: '',
            specialtyId: '',
        }
    }

    componentDidMount() {
        this.props.fetchAllDoctors();
        this.props.getRequiredDoctorInfor();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.allDoctors !== this.props.allDoctors) {

            let dataSelect = this.buildDataInputSelect(this.props.allDoctors, 'USERS')
            this.setState({
                listDoctors: dataSelect
            })
        }

        if (prevProps.allRequiredDoctorInfor !== this.props.allRequiredDoctorInfor) {
            let { resPayment, resPrice, resProvince, resSpecialty, resClinic } = this.props.allRequiredDoctorInfor;

            let dataSelectPrice = this.buildDataInputSelect(resPrice, 'PRICE');
            let dataSelectPayment = this.buildDataInputSelect(resPayment, 'PAYMENT');
            let dataSelectProvince = this.buildDataInputSelect(resProvince, 'PROVINCE');
            let dataSelectSpecialty = this.buildDataInputSelect(resSpecialty, 'SPECIALTY');
            let dataSelectClinic = this.buildDataInputSelect(resClinic, 'CLINIC');

            this.setState({
                listPrice: dataSelectPrice,
                listPayment: dataSelectPayment,
                listProvince: dataSelectProvince,
                listSpecialty: dataSelectSpecialty,
                listClinic: dataSelectClinic,
            })

        }

        if (prevProps.language !== this.props.language) {
            let dataSelect = this.buildDataInputSelect(this.props.allDoctors, 'USERS');
            let { resPayment, resPrice, resProvince } = this.props.allRequiredDoctorInfor;
            let dataSelectPrice = this.buildDataInputSelect(resPrice, 'PRICE');
            let dataSelectPayment = this.buildDataInputSelect(resPayment, 'PAYMENT');
            let dataSelectProvince = this.buildDataInputSelect(resProvince, 'PROVINCE');
            this.setState({
                listDoctors: dataSelect,
                listPrice: dataSelectPrice,
                listPayment: dataSelectPayment,
                listProvince: dataSelectProvince,
            })
        }
    }

    buildDataInputSelect = (inputData, type) => {
        let result = [];
        let { language } = this.props;
        if (inputData && inputData.length > 0) {
            if (type === 'USERS') {
                inputData.map((item, index) => {
                    let object = {};
                    let labelVi = `${item.lastName} ${item.firstName}`;
                    let labelEn = `${item.firstName} ${item.lastName}`;
                    object.label = language === LANGUAGE.VI ? labelVi : labelEn
                    object.value = item.id;
                    result.push(object);
                })
            }

            if (type === 'PRICE') {
                inputData.map((item, index) => {
                    let object = {};
                    let labelVi = `${item.valueVi}`;
                    let labelEn = `${item.valueEn} USD`;
                    object.label = language === LANGUAGE.VI ? labelVi : labelEn
                    object.value = item.keyMap;
                    result.push(object);
                })
            }

            if (type === 'PAYMENT' || type === 'PROVINCE') {
                inputData.map((item, index) => {
                    let object = {};
                    let labelVi = `${item.valueVi}`;
                    let labelEn = `${item.valueEn}`;
                    object.label = language === LANGUAGE.VI ? labelVi : labelEn
                    object.value = item.keyMap;
                    result.push(object);
                })
            }

            if (type === 'SPECIALTY') {
                inputData.map((item, index) => {
                    let object = {};
                    object.label = item.name;
                    object.value = item.id;
                    result.push(object)
                })
            }

            if (type === 'CLINIC') {
                inputData.map((item, index) => {
                    let object = {};
                    object.label = item.name;
                    object.value = item.id;
                    result.push(object)
                })
            }
        }

        return result
    }


    handleEditorChange = ({ html, text }) => {

        this.setState({
            contentMarkdown: text,
            contentHTML: html,
        })
    }

    handleSaveContentMarkdown = () => {
        console.log('check req react', this.state.selectedPrice);
        let { hasOldData } = this.state
        this.props.saveDetailDoctor({
            contentHTML: this.state.contentHTML,
            contentMarkdown: this.state.contentMarkdown,
            description: this.state.description,
            doctorId: this.state.selectedOption.value,
            action: hasOldData === true ? CRUD_ACTIONS.EDIT : CRUD_ACTIONS.CREATE,
            selectedPrice: this.state.selectedPrice,
            selectedPayment: this.state.selectedPayment,
            selectedProvince: this.state.selectedProvince,
            nameClinic: this.state.nameClinic,
            addressClinic: this.state.addressClinic,
            note: this.state.note,
            clinicId: this.state.selectedClinic && this.state.selectedClinic.value ? this.state.addressClinic.value : '',
            specialty: this.state.selectedSpecialty.value
        })
    }

    handleChangeSelec = async (selectedOption) => {
        this.setState({ selectedOption })
        let { listPayment, listPrice, listProvince, listSpecialty, listClinic } = this.state

        let res = await getDetailInforDoctor(selectedOption.value);
        if (res && res.errCode === 0 && res.data && res.data.Markdown) {
            let markdown = res.data.Markdown;

            let selectedPrice = '',
                selectedPayment = '',
                selectedProvince = '',
                addressClinic = '',
                nameClinic = '',
                note = '',
                paymentId = '',
                priceId = '',
                specialtyId = '',
                provinceId = '',
                selectedSpecialty = '',
                clinicId = '',
                selectedClinic = '';

            if (res.data.Doctor_Infor) {
                addressClinic = res.data.Doctor_Infor.addressClinic;
                nameClinic = res.data.Doctor_Infor.nameClinic;
                note = res.data.Doctor_Infor.note;
                paymentId = res.data.Doctor_Infor.paymentId;
                priceId = res.data.Doctor_Infor.priceId;
                provinceId = res.data.Doctor_Infor.provinceId;
                specialtyId = res.data.Doctor_Infor.specialtyId;
                clinicId = res.data.Doctor_Infor.clinicId;

                selectedPayment = listPayment.find(item => {
                    return item && item.value === paymentId
                })
                selectedPrice = listPrice.find(item => {
                    return item && item.value === priceId
                })
                selectedProvince = listProvince.find(item => {
                    return item && item.value === provinceId
                })
                selectedSpecialty = listSpecialty.find(item => {
                    return item && item.value === specialtyId
                })
                selectedClinic = listClinic.find(item => {
                    return item && item.value === clinicId
                })
            }

            this.setState({
                contentHTML: markdown.contentHTML,
                contentMarkdown: markdown.contentMarkdown,
                description: markdown.description,
                hasOldData: true,
                addressClinic: addressClinic,
                nameClinic: nameClinic,
                note: note,
                selectedPayment: selectedPayment,
                selectedPrice: selectedPrice,
                selectedProvince: selectedProvince,
                selectedSpecialty: selectedSpecialty,
                selectedClinic: selectedClinic,

            })
        } else {
            this.setState({
                contentHTML: '',
                contentMarkdown: '',
                description: '',
                hasOldData: false,
                addressClinic: '',
                nameClinic: '',
                note: '',
                selectedPayment: '',
                selectedPrice: '',
                selectedProvince: '',
                selectedSpecialty: '',
                selectedClinic: '',
            })
        }
    }

    handleOnChangeDesc = (event) => {
        this.setState({
            description: event.target.value
        })
    }

    handleChangeSelectDoctorInfor = async (selectedOption, name) => {
        let stateName = name.name;
        let stateCopy = { ...this.state };
        stateCopy[stateName] = selectedOption.value;
        await this.setState({
            ...stateCopy
        })

        console.log('check data', this.state.selectedPrice);
        console.log('check select', selectedOption);
        console.log('check name', name);
        console.log('check copy', stateCopy);
    }

    handleOnChangeText = (event, id) => {
        let stateCopy = { ...this.state };
        stateCopy[id] = event.target.value;
        this.setState({
            ...stateCopy
        })
    }

    render() {
        let { hasOldData } = this.state;
        return (
            <div className='manage-doctor-container'>
                <div className='manage-doctor-title'>
                    <FormattedMessage id={'admin.manage-doctor.title'} />
                </div>
                <div className='more-info'>
                    <div className='content-left form-group'>
                        <label><FormattedMessage id={'admin.manage-doctor.select-doctor'} /></label>
                        <Select
                            value={this.state.selectedOption}
                            onChange={(event) => this.handleChangeSelec(event)}
                            options={this.state.listDoctors}
                            placeholder={<FormattedMessage id={'admin.manage-doctor.select-doctor'} />}
                        />
                    </div>
                    <div className='content-right'>
                        <label><FormattedMessage id={'admin.manage-doctor.intro'} /></label>
                        <textarea className='form-control'
                            onChange={(event) => this.handleOnChangeText(event, 'description')}
                            value={this.state.description}
                        >
                        </textarea>
                    </div>
                </div>

                <div className='more-infor-extra row'>
                    <div className='col-4 form-group'>
                        <label><FormattedMessage id={'admin.manage-doctor.price'} /></label>
                        <Select
                            onChange={this.handleChangeSelectDoctorInfor}
                            options={this.state.listPrice}
                            name="selectedPrice"
                            placeholder={<FormattedMessage id={'admin.manage-doctor.price'} />}
                            value={this.state.selectedPrice}
                        />
                    </div>
                    <div className='col-4 form-group'>
                        <label><FormattedMessage id={'admin.manage-doctor.payment'} /></label>
                        <Select
                            onChange={this.handleChangeSelectDoctorInfor}
                            options={this.state.listPayment}
                            name="selectedPayment"
                            placeholder={<FormattedMessage id={'admin.manage-doctor.payment'} />}
                            value={this.state.selectedPayment}
                        />
                    </div>
                    <div className='col-4 form-group'>
                        <label><FormattedMessage id={'admin.manage-doctor.province'} /></label>
                        <Select
                            onChange={this.handleChangeSelectDoctorInfor}
                            options={this.state.listProvince}
                            name="selectedProvince"
                            placeholder={<FormattedMessage id={'admin.manage-doctor.province'} />}
                            value={this.state.selectedProvince}
                        />
                    </div>
                    <div className='col-4 form-group'>
                        <label><FormattedMessage id={'admin.manage-doctor.nameClinic'} /></label>
                        <textarea className='form-control'
                            onChange={(event) => this.handleOnChangeText(event, 'nameClinic')}
                            value={this.state.nameClinic}
                        >
                        </textarea>
                    </div>
                    <div className='col-4 form-group'>
                        <label><FormattedMessage id={'admin.manage-doctor.addressClinic'} /></label>
                        <textarea className='form-control'
                            onChange={(event) => this.handleOnChangeText(event, 'addressClinic')}
                            value={this.state.addressClinic}
                        >
                        </textarea>
                    </div>
                    <div className='col-4 form-group'>
                        <label><FormattedMessage id={'admin.manage-doctor.note'} /></label>
                        <textarea className='form-control'
                            onChange={(event) => this.handleOnChangeText(event, 'note')}
                            value={this.state.note}
                        >
                        </textarea>
                    </div>
                </div>

                <div className='row'>
                    <div className='col-4 form-group'>
                        <label><FormattedMessage id={'admin.manage-doctor.specialty'} /></label>
                        <Select
                            onChange={this.handleChangeSelectDoctorInfor}
                            options={this.state.listSpecialty}
                            name="selectedSpecialty"
                            placeholder={<FormattedMessage id={'admin.manage-doctor.specialty'} />}
                            value={this.state.selectedSpecialty}
                        />
                    </div>
                    <div className='col-4 form-group'>
                        <label><FormattedMessage id={'admin.manage-doctor.select-clinic'} /></label>
                        <Select
                            onChange={this.handleChangeSelectDoctorInfor}
                            options={this.state.listClinic}
                            name="selectedClinic"
                            placeholder={<FormattedMessage id={'admin.manage-doctor.select-clinic'} />}
                            value={this.state.selectedClinic}
                        />
                    </div>
                </div>

                <div className='manage-doctor-editor'>
                    <MdEditor
                        style={{ height: '300px' }}
                        renderHTML={text => mdParser.render(text)}
                        onChange={this.handleEditorChange}
                        value={this.state.contentMarkdown}
                    />
                </div>
                <button
                    onClick={() => this.handleSaveContentMarkdown()}
                    className={hasOldData === true ? 'save-content-doctor' : 'create-content-doctor'}
                >
                    {hasOldData === true ?
                        <span><FormattedMessage id={'admin.manage-doctor.save'} /></span> :
                        <span><FormattedMessage id={'admin.manage-doctor.add'} /></span>
                    }
                </button>
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        allDoctors: state.admin.allDoctors,
        allRequiredDoctorInfor: state.admin.allRequiredDoctorInfor,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchAllDoctors: () => dispatch(actions.fetchAllDoctors()),
        getRequiredDoctorInfor: () => dispatch(actions.getRequiredDoctorInfor()),
        saveDetailDoctor: (data) => dispatch(actions.saveDetailDoctor(data))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageDoctor);
