import React from "react";
import { Redirect, Route, Link } from "react-router-dom";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

const PrivateRoute = ({ component: Component, auth, adminOnly, ...rest }) => {
    return (
        <Route
            {...rest}
            render={props =>
                !auth.loading ? (
                    auth.currentUser ? (
                        adminOnly ? (
                            auth.currentUser.is_admin ? (
                                <Component {...props} />
                            ) : (
                                <Redirect
                                    to={{
                                        pathname: "/login",
                                        state: { from: props.location }
                                    }}
                                />
                            )
                        ) : (
                            <Component {...props} />
                        )
                    ) : (
                        <Redirect
                            to={{
                                pathname: "/login",
                                state: { from: props.location }
                            }}
                        />
                    )
                ) : (
                    <div>
                        Vui lòng 
                        <Link to="/login">đăng nhập</Link> bằng tài khoản Admin
                    </div>
                )
            }
        />
    );
};

const mapStateToProps = state => {
    return {
        auth: state.auth
    };
};

export default withRouter(connect(mapStateToProps)(PrivateRoute));
