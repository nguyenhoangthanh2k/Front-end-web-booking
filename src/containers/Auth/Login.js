import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from "connected-react-router";

import * as actions from "../../store/actions";
import './Login.scss';
import { FormattedMessage } from 'react-intl';
import { handleLoginApi } from '../../services/userService'
import { userLoginSuccess } from '../../store/actions';


class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            isShowPassWord: false,
            errMessage: '',
        }
    }

    handleOnChangeInput = async (event, field) => {

        if (field === 'username') {
            await this.setState({
                username: event.target.value
            })

        } else if (field === 'password') {
            await this.setState({
                password: event.target.value
            })
        }
    }

    handleLogin = async () => {
        this.setState({
            errMessage: ''
        })
        try {
            let data = await handleLoginApi(this.state.username, this.state.password);
            if (data && data.errCode !== 0) {
                this.setState({
                    errMessage: data.message
                })
            }

            if (data && data.errCode === 0) {
                this.props.userLoginSuccess(data.user);
                console.log('success login ');
            }
        } catch (error) {
            if (error.response) {
                if (error.response.data) {
                    this.setState({
                        errMessage: error.response.data.message
                    })
                }
            }

        }
    }

    handleShowHidePassword = (e) => {
        if (this.state.isShowPassWord) {
            this.setState({
                isShowPassWord: false
            })
        } else {
            this.setState({
                isShowPassWord: true
            })
        }
    }

    handleKeyDown = (even) => {
        if (even.key === 'Enter' || even.keyCode === 13) {
            this.handleLogin()
        }
    }

    render() {
        return (
            <div className='login-background'>
                <div className='login-container'>
                    <div className='login-content row'>
                        <div className='col-12 login-text'>Login</div>
                        <div className='col-12 form-group login-input'>
                            <label className='field'>Username:</label>
                            <input type='text'
                                className='form-control'
                                placeholder='Enter your username'
                                onChange={(event) => this.handleOnChangeInput(event, 'username')} />
                        </div>
                        <div className='col-12 form-group login-input'>
                            <label className='field'>Password:</label>
                            <div className='input-password'>
                                <input type={this.state.isShowPassWord ? 'text' : 'password'}
                                    className='form-control'
                                    placeholder='Enter your password'
                                    onChange={(event) => this.handleOnChangeInput(event, 'password')}
                                    onKeyDown={(even) => this.handleKeyDown(even)}
                                />
                                <span onClick={(e) => this.handleShowHidePassword()}>

                                    <i className={this.state.isShowPassWord ? 'fas fa-eye eye-password' : 'fas fa-eye-slash eye-password'}></i>
                                </span>
                            </div>
                        </div>

                        <div className='col-12' style={{ color: 'red' }}>
                            {this.state.errMessage}
                        </div>
                        <div className='col-12'>
                            <button className='login-btn'
                                onClick={(e) => this.handleLogin()}>Login</button>
                        </div>
                        <div className='col-12'>
                            <span className='forgot-password'>Forgot your password</span>
                        </div>
                        <div className='col-12 text-center mt-5'>
                            <span className='text-other-login'>Or Login with:</span>
                        </div>
                        <div className='col-12 social-login'>
                            <i className="fab fa-google-plus google"></i>
                            <i className="fab fa-facebook facebook"></i>
                        </div>
                    </div>
                </div>

            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language
    };
};

const mapDispatchToProps = dispatch => {
    return {
        navigate: (path) => dispatch(push(path)),
        // userLoginFail: () => dispatch(actions.adminLoginFail()),
        userLoginSuccess: (userInfo) => dispatch(actions.userLoginSuccess(userInfo)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
