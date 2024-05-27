import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Header from '../Header/index'

const categoriesList = [
  {id: 'ALL', displayText: 'All'},
  {id: 'STATIC', displayText: 'Static'},
  {id: 'RESPONSIVE', displayText: 'Responsive'},
  {id: 'DYNAMIC', displayText: 'Dynamic'},
  {id: 'REACT', displayText: 'React'},
]

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Category extends Component {
  state = {
    selectedCategory: 'ALL',
    apiStatus: apiStatusConstants.initial,
    products: [],
  }

  componentDidMount() {
    this.getProducts()
  }

  getProducts = async () => {
    const {selectedCategory} = this.state
    this.setState({apiStatus: apiStatusConstants.inProgress})

    const url = `https://apis.ccbp.in/ps/projects?category=${selectedCategory}`

    try {
      const response = await fetch(url)
      const data = await response.json()
      console.log(data)
      if (response.ok) {
        this.setState({
          products: data.projects,
          apiStatus: apiStatusConstants.success,
        })
      } else {
        this.setState({apiStatus: apiStatusConstants.failure})
      }
    } catch (error) {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  handleCategoryChange = event => {
    this.setState({selectedCategory: event.target.value}, this.getProducts)
  }

  retryClicked = () => this.getProducts()

  renderFailureView = () => (
    <div className="products-error-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png"
        alt="failure view"
        className="products-failure-img"
      />
      <h1 className="product-failure-heading-text">
        Oops! Something Went Wrong
      </h1>
      <p className="products-failure-description">
        We cannot seem to find the page you are looking for
      </p>
      <button type="button" onClick={this.retryClicked}>
        Retry
      </button>
    </div>
  )

  renderProductsListView = () => {
    const {products} = this.state
    return (
      <ul>
        {products.map(product => (
          <li key={product.id}>
            <img src={product.image_url} alt={product.name} />
            <p>{product.name}</p>
          </li>
        ))}
      </ul>
    )
  }

  renderLoadingView = () => (
    <div className="products-loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  renderAllProducts = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderProductsListView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    return (
      <div>
        <h1>Category Page</h1>
        <Header />
        <select onChange={this.handleCategoryChange}>
          {categoriesList.map(category => (
            <option key={category.id} value={category.id}>
              {category.displayText}
            </option>
          ))}
        </select>
        {this.renderAllProducts()}
      </div>
    )
  }
}

export default Category
