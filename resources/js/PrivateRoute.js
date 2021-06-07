import React from "react";
import { Redirect, Route, Link } from "react-router-dom";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

const PrivateRoute = ({ component: Component, auth, ...rest }) => {
    return (
        <Route
            {...rest}
            render={props =>
                !auth.loading ? (
                    auth.currentUser ? (
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
                    <div className="not-auth-text fullscreen-min-height d-flex justify-content-center align-items-center">
                        Vui lòng
                        <Link to="/login">&nbsp;đăng nhập&nbsp;</Link> để xem thông tin
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
