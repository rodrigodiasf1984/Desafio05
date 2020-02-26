import React, { Component } from 'react';
import { FaSpinner } from 'react-icons/fa';
import { GoThumbsdown, GoThumbsup, GoCode } from 'react-icons/go';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import api from '../../services/api';
import { Loading, Owner, IssueList, Pagination, IssueLabel } from './styles';
import Container from '../../Components/Container';
import Filter from '../../Components/Filter';
import Button from '../../Components/Button';

class Repository extends Component {
  constructor(props) {
    super(props);
    this.state = {
      repository: {},
      issues: [],
      loading: true,
      filter: 'all',
      page: 1,
      perPage: 5,
      searching: false,
    };
  }

  async componentDidMount() {
    const { filter, perPage, page } = this.state;
    const { match } = this.props;
    const repoName = decodeURIComponent(match.params.repository);

    // api.github.com/repos/facebook/react
    // fazer duas chamadas ao mesmo tempo utilizar o Promise.all
    const [repository, issues] = await Promise.all([
      api.get(`/repos/${repoName}`),
      api.get(`/repos/${repoName}/issues`, {
        params: {
          state: filter,
          per_page: perPage,
          page,
        },
      }),
    ]);

    this.setState({
      repository: repository.data,
      issues: issues.data,
      loading: false,
    });
  }

  handleFilterChangeOptions = async e => {
    if (e.target.value) {
      const { match } = this.props;
      const { filter: oldFilter, perPage } = this.state;
      const filter = e.target.value;
      const repoName = decodeURIComponent(match.params.repository);

      if (filter === oldFilter) {
        return;
      }

      const issuesFiltered = await api.get(`/repos/${repoName}/issues`, {
        params: {
          state: filter,
          per_page: perPage,
          page: 1,
        },
      });
      this.setState({
        issues: issuesFiltered.data,
        filter,
        page: 1,
      });
    }
  };

  handlePagination = async (e, page) => {
    if (e.target.disabled) {
      return;
    }
    const { filter, perPage } = this.state;
    const { match } = this.props;
    const repoName = decodeURIComponent(match.params.repository);
    this.setState({
      searching: true,
    });
    const issues = await api.get(`/repos/${repoName}/issues`, {
      params: {
        state: filter,
        per_page: perPage,
        page,
      },
    });
    this.setState({ issues: issues.data, page, searching: false });
  };

  render() {
    const {
      repository,
      issues,
      loading,
      filter,
      page,
      perPage,
      searching,
    } = this.state;
    if (loading) {
      return (
        <Loading>
          Carregando
          <FaSpinner color="#fff" size={30} />
        </Loading>
      );
    }

    return (
      <Container>
        <Owner>
          <Link to="/">Voltar aos repositórios</Link>
          <img src={repository.owner.avatar_url} alt={repository.owner.login} />
          <h1>{repository.name}</h1>
          <p>{repository.description}</p>
        </Owner>

        <Filter>
          <Button
            id={1}
            value="open"
            type="button"
            disabled={filter === 'open' ? true : undefined}
            onClick={this.handleFilterChangeOptions}
          >
            <GoThumbsdown color="#FFF" size={20} />
            <p>Abertas</p>
          </Button>

          <Button
            id={2}
            value="closed"
            type="button"
            disabled={filter === 'closed' ? true : undefined}
            onClick={this.handleFilterChangeOptions}
          >
            <GoThumbsup color="#FFF" size={20} />
            <p>Fechadas</p>
          </Button>

          <Button
            id={3}
            value="all"
            type="button"
            disabled={filter === 'all' ? true : undefined}
            onClick={this.handleFilterChangeOptions}
          >
            <GoCode color="#FFF" size={20} />
            <p>Todas</p>
          </Button>
        </Filter>

        <IssueList>
          {issues.map(issue => (
            <li key={String(issue.id)}>
              <img src={issue.user.avatar_url} alt={issue.user.login} />
              <div>
                <strong>
                  <a target="blank" href={issue.html_url}>
                    {issue.title}
                  </a>
                  {issue.labels.map(label => (
                    <IssueLabel
                      color={`#${label.color}`}
                      key={String(label.id)}
                    >
                      {label.name}
                    </IssueLabel>
                  ))}
                </strong>
                <p>{issue.user.login}</p>
              </div>
            </li>
          ))}
        </IssueList>
        <Pagination>
          <Button
            disabled={(page <= 1 || searching) && true}
            value="prev"
            type="button"
            onClick={e => this.handlePagination(e, page - 1)}
          >
            <p>Anterior</p>
          </Button>
          <span>{searching ? <FaSpinner /> : `Página ${page}`}</span>
          <Button
            value="next"
            type="button"
            disabled={(issues.length < perPage || searching) && true}
            onClick={e => this.handlePagination(e, page + 1)}
          >
            <p>Próxima</p>
          </Button>
        </Pagination>
      </Container>
    );
  }
}

Repository.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      repository: PropTypes.string,
    }),
  }).isRequired,
};

export default Repository;
