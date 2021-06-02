import React, { Component } from "react";
import Http from "../../Http";
import { Link } from "react-router-dom";
import "./css/ProductDetail.scss";
import { connect } from "react-redux";
import moment from "moment";

class QuestionComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            quantity: 1,
            question: "",
            answer: [],
            error: { question: "", answer: "" }
        };
        this._isMounted = false;

        this.onChangeQuestion = this.onChangeQuestion.bind(this);
        this.onQuestionSubmit = this.onQuestionSubmit.bind(this);
        this.onChangeAnswer = this.onChangeAnswer.bind(this);
        this.onAnswerSubmit = this.onAnswerSubmit.bind(this);
    }
    componentDidMount() {
        this._isMounted = true;
    }
    componentWillUnmount() {
        this._isMounted = false;
    }
    onChangeQuestion(e) {
        this.setState({ question: e.target.value });
    }
    onQuestionSubmit(e) {
        e.preventDefault();
        if (!this.state.question && this._isMounted) {
            this.setState(prevState => {
                let error = { ...prevState.error };
                error.question = "Hãy nhập nội dung câu hỏi!";
                return { error };
            });
        } else {
            if (this.props.auth.currentUser) {
                Http.defaults.headers.common["Authorization"] =
                    "Bearer " + localStorage["auth_token"];
            } else {
                console.log("Chưa login");
            }
            let uri = "http://localhost:8000/api/question";
            const newQuestion = {
                product_id: this.props.detail.id,
                content: this.state.question
            };
            Http.post(uri, newQuestion).then(response => {
                if (response.data && this._isMounted) {
                    this.props.setProductQuestion(response.data);
                    this.setState({
                        error: { question: "", answer: "" },
                        question: ""
                    });
                }
            });
        }
    }
    onChangeAnswer(e) {
        let index = e.target.dataset.index;
        let value = e.target.value;
        this.setState(prevState => {
            let answer = [...prevState.answer];
            answer[index] = value;
            return { answer };
        });
    }
    onAnswerSubmit(e) {
        var index = e.target.dataset.index;
        if (!this.state.answer[index] && this._isMounted) {
            this.setState(prevState => {
                let error = { ...prevState.error };
                error.answer = "Hãy nhập nội dung câu trả lời!";
                return { error };
            });
        } else {
            let uri = "http://localhost:8000/api/answer";
            const newAnswer = {
                question_id: e.target.dataset.questionid,
                content: this.state.answer[index]
            };
            Http.post(uri, newAnswer).then(response => {
                if (response.data && this._isMounted) {
                    response.data.index = index;
                    this.props.setProductAnswer(response.data);
                    if (this._isMounted) {
                        this.setState(prevState => {
                            let error = { question: "", answer: "" };
                            let answer = [...prevState.answer];
                            answer[index] = "";
                            return { error, answer };
                        });
                    }
                }
            });
        }
    }
    showQuestions(questions) {
        return (
            <React.Fragment>
                {this.props.auth.currentUser ? (
                    <div className="question-textarea d-flex flex-column align-items-end">
                        <textarea
                            placeholder="Nhập câu hỏi"
                            rows="4"
                            onChange={this.onChangeQuestion}
                            value={this.state.question}
                        />
                        {this.state.error.question && (
                            <div className="validate">
                                {this.state.error.question}
                            </div>
                        )}
                        <button onClick={this.onQuestionSubmit}>
                            Gửi câu hỏi
                        </button>
                    </div>
                ) : (
                    <div>
                        <Link to="/login">Đăng nhập</Link> để có thể đặt và trả
                        lời câu hỏi
                    </div>
                )}

                {questions.map((question, index) => (
                    <React.Fragment key={index}>
                        <hr />
                        <div className="asker-answerer-name">
                            {question.asker.name}
                        </div>
                        <div className="question-answer-datetime">
                            {moment(question.created_at).format(
                                "HH:mm, DD/MM/YYYY"
                            )}
                        </div>
                        <div className="question-answer-content">
                            {question.content}
                        </div>
                        <div className="answer-content d-flex flex-column">
                            {question.answers
                                ? question.answers.map((answer, index) => (
                                      <div className="answer" key={index}>
                                          <hr />
                                          <div className="asker-answerer-name">
                                              {answer.answerer
                                                  ? answer.answerer.name
                                                  : null}
                                          </div>
                                          <div className="question-answer-datetime">
                                              {moment(answer.created_at).format(
                                                  "HH:mm, DD/MM/YYYY"
                                              )}
                                          </div>
                                          <div className="question-answer-content">
                                              {answer.content}
                                          </div>
                                      </div>
                                  ))
                                : null}
                            {this.props.auth.currentUser ? (
                                <div className="reply d-flex flex-column align-items-end">
                                    <textarea
                                        data-index={index}
                                        placeholder="Nhập câu trả lời"
                                        rows="3"
                                        onChange={this.onChangeAnswer}
                                        value={this.state.answer[index]}
                                    />
                                    {this.state.error.answer && (
                                        <div className="validate">
                                            {this.state.error.answer}
                                        </div>
                                    )}
                                    <button
                                        data-index={index}
                                        data-questionid={question.id}
                                        onClick={this.onAnswerSubmit}
                                    >
                                        Trả lời
                                    </button>
                                </div>
                            ) : null}
                        </div>
                    </React.Fragment>
                ))}
            </React.Fragment>
        );
    }

    render() {
        let questions = this.props.detail.questions;
        return questions ? this.showQuestions(questions) : null;
    }
}

const mapStateToProps = state => {
    return {
        detail: state.productDetail.detail,
        auth: state.auth
    };
};

const mapDispatchToProps = dispatch => {
    return {
        setProductQuestion: question => {
            dispatch({
                type: "SET_PRODUCT_QUESTION",
                payload: question
            });
        },
        setProductAnswer: answer => {
            dispatch({
                type: "SET_PRODUCT_ANSWER",
                payload: answer
            });
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(QuestionComponent);
