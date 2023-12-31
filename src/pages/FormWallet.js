/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  fetchAPI as fetchApi,
  fetchAPIExpenses as fetchApiExpenses,
  actionAddStateExpenses } from '../actions/index';

class FormWallet extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: '',
      value: '',
      currency: '',
      method: 'Cartão de crédito',
      tag: '',
      description: '',
      exchangeRates: {},
    };
    this.renderSelectCategory = this.renderSelectCategory.bind(this);
    this.renderSelectMethod = this.renderSelectMethod.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.renderTable = this.renderTable.bind(this);
  }

  componentDidMount() {
    const { fetchAPI } = this.props;
    fetchAPI();
  }

  handleSubmit() {
    const { fetchAPIExpenses, actionAddState, expensesArr } = this.props;

    fetchAPIExpenses().then((expenses) => this.setState({
      id: expensesArr.length,
      exchangeRates: expenses,
    })).then(() => actionAddState(this.state));
  }

  handleChange({ target: { name, value } }) {
    this.setState({
      [name]: value,
    });
  }

  renderSelectCategory() {
    return (
      <label htmlFor="tag">
        Tag
        <select
          name="tag"
          id="tag"
          onChange={ this.handleChange }
        >
          <option value="Alimentação">Alimentação</option>
          <option value="Lazer">Lazer</option>
          <option value="Trabalho">Trabalho</option>
          <option value="Transporte">Transporte</option>
          <option value="Saúde">Saúde</option>
        </select>
      </label>
    );
  }

  renderSelectMethod() {
    return (
      <label htmlFor="method">
        Método de pagamento
        <select
          name="method"
          id="method"
          onChange={ this.handleChange }
        >
          <option value="Dinheiro">Dinheiro</option>
          <option value="Cartão de crédito">Cartão de crédito</option>
          <option value="Cartão de débito">Cartão de débito</option>
        </select>
      </label>
    );
  }

  renderTable() {
    const { expensesArr } = this.props;
    return (
      <div>
        <table>
          <tr>
            <th>Descrição</th>
            <th>Tag</th>
            <th>Método de pagamento</th>
            <th>Valor</th>
            <th>Moeda</th>
            <th>Câmbio utilizado</th>
            <th>Valor convertido</th>
            <th>Moeda de conversão</th>
            <th>Editar/Excluir</th>
          </tr>
          {expensesArr.map((expense, i) => (
            <tr key={ i }>
              <td>{expense.description}</td>
              <td>{expense.tag}</td>
              <td>{expense.method}</td>
              <td>{expense.value}</td>
              <td>
                {Object.values(expense.exchangeRates)
                  .map((ex) => (ex.code === expense.currency
                    && ex.codein !== 'BRLT' ? (ex.name.split('/')[0]) : null))}
              </td>
              <td>
                {Object.values(expense.exchangeRates)
                  .map((ex) => (ex.code === expense.currency
                    && ex.codein !== 'BRLT' ? ((ex.ask * 100) / 100).toFixed(2) : null))}
              </td>
              <td>
                {Object.values(expense.exchangeRates)
                  .map((ex) => (ex.code === expense.currency
                    && ex.codein !== 'BRLT'
                    ? (ex.ask * expense.value).toFixed(2) : null))}
              </td>
              <td>
                Real
              </td>
            </tr>
          ))}
        </table>
      </div>
    );
  }

  render() {
    const { currencies } = this.props;
    // console.log(currencies);
    return (
      <div>
        <form onSubmit={ (e) => e.preventDefault() }>
          <label htmlFor="value">
            Valor
            <input
              type="text"
              name="value"
              id="value"
              onChange={ this.handleChange }
            />
          </label>
          <label htmlFor="description">
            Descrição
            <input
              type="text"
              name="description"
              id="description"
              onChange={ this.handleChange }
            />
          </label>
          <label htmlFor="currency">
            Moeda
            <select
              name="currency"
              id="currency"
              onChange={ this.handleChange }
            >
              {currencies.map((c) => <option value={ c } key={ c }>{c}</option>)}
            </select>
          </label>
          { this.renderSelectMethod() }
          { this.renderSelectCategory() }
          <button
            type="submit"
            onClick={ () => this.handleSubmit() }
          >
            Adicionar despesa
          </button>
        </form>
        { this.renderTable() }
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  fetchAPI: () => dispatch(fetchApi()),
  fetchAPIExpenses: () => dispatch(fetchApiExpenses()),
  actionAddState: (state) => dispatch(actionAddStateExpenses(state)),
});

const mapStateToProps = (state) => ({
  currencies: state.wallet.currencies,
  expensesArr: state.wallet.expenses,
});

FormWallet.propTypes = {
  currencies: PropTypes.arrayOf(PropTypes.arrayOf).isRequired,
  fetchAPI: PropTypes.func.isRequired,
  fetchAPIExpenses: PropTypes.func.isRequired,
  actionAddState: PropTypes.func.isRequired,
  expensesArr: PropTypes.arrayOf(PropTypes.arrayOf).isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(FormWallet);
