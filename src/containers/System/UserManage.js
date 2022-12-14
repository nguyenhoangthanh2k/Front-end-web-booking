import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import './UserManage.scss';
import { getAllUsers, createNewUserService, deleteUserService, editUserService } from '../../services/userService';
import ModalUser from './ModalUser';
import ModalEditUser from './ModalEditUser';
import { emitter } from '../../utils/emitter';
class UserManage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            arrUsers: [],
            isOpenModal: false,
            isOpenEditModal: false,
            userEdit: {}
        }
    }

    async componentDidMount() {
        await this.getAllUserFromReact()
    }

    toggleUserModal = () => {
        this.setState({
            isOpenModal: !this.state.isOpenModal
        })
    }

    toggleEditUserModal = () => {
        this.setState({
            isOpenEditModal: !this.state.isOpenEditModal
        })
    }

    handleAddANewUser = () => {
        this.setState({
            isOpenModal: true
        })
    }

    getAllUserFromReact = async () => {
        let response = await getAllUsers('ALL');
        if (response && response.errCode === 0) {
            this.setState({
                arrUsers: response.users
            })
        }
    }

    createNewUser = async (data) => {
        try {
            let response = await createNewUserService(data)
            if (response && response.errCode !== 0) {
                alert(response.errMessage);
            } else {
                await this.getAllUserFromReact();
                this.setState({
                    isOpenModal: false,
                })
                emitter.emit('EVENT_CLEAR_MODAL_DATA');
            }
        } catch (e) {
            console.log(e);
        }
    }

    handleDeleteUser = async (user) => {
        try {
            let res = await deleteUserService(user.id);
            if (res && res.errCode === 0) {
                await this.getAllUserFromReact()
            } else {
                alert(res.errMessage);
            }
        } catch (e) {
            console.log(e);
        }
    }

    handleEditUser = async (user) => {
        try {
            this.setState({
                isOpenEditModal: true,
                userEdit: user,
            })
        } catch (e) {
            console.log(e);
        }
    }

    doEditUser = async (user) => {
        try {
            let res = await editUserService(user);
            if (res && res.errCode === 0) {
                await this.getAllUserFromReact();

                this.setState({
                    isOpenEditModal: false,
                })

            } else {
                alert(res.errMessage);
            }
        } catch (e) {
            console.log(e);
        }
        console.log('user', user);
    }


    render() {
        let arrusers = this.state.arrUsers;
        return (
            <div className="users-container">
                <ModalUser
                    isOpenModal={this.state.isOpenModal}
                    toggleFromParent={this.toggleUserModal}
                    createNewUser={this.createNewUser}
                />
                {this.state.isOpenEditModal &&
                    <ModalEditUser
                        isOpenModal={this.state.isOpenEditModal}
                        toggleFromParent={this.toggleEditUserModal}
                        currentUser={this.state.userEdit}
                        editUser={this.doEditUser}
                    />
                }
                <div className='title text-center'>manager users</div>
                <div className='mx-1'>
                    <button className='btn btn-primary px-3'
                        onClick={() => this.handleAddANewUser()}
                    ><i className="fas fa-plus"></i> Add a new user</button>
                </div>
                <div className='users-table mt-4 mx-1'>
                    <table id="customers">
                        <thead>
                            <tr>
                                <th>Email</th>
                                <th>First name</th>
                                <th>last name</th>
                                <th>address</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {arrusers && arrusers.map((item, index) => {
                                return (

                                    <tr>
                                        <td>{item.email}</td>
                                        <td>{item.firstName}</td>
                                        <td>{item.lastName}</td>
                                        <td>{item.address}</td>
                                        <td>
                                            <button onClick={() => this.handleEditUser(item)} className='btn-edit'><i className="fas fa-pencil-alt"></i></button>
                                            <button onClick={() => this.handleDeleteUser(item)} className='btn-delete'><i className="fas fa-trash"></i></button>
                                        </td>
                                    </tr>
                                )
                            })}

                        </tbody>
                    </table>
                </div>
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserManage);
