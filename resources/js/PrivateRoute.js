import React from "react";
import { Redirect, Route } from "react-router-dom";
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
                ) : null
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
