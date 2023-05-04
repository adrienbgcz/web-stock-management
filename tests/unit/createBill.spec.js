import CreateBill from "@/views/CreateBill";
import {shallowMount, createLocalVue} from "@vue/test-utils";
import Vuex from 'vuex'

const localVue = createLocalVue()
localVue.use(Vuex)

const productsData = [
    {"id": 1, "name": "product1", "price": 100, "stock_quantity": 1, "serial_number": "1111", "picture": "https://picture1"},
    {"id": 2, "name": "product2", "price": 200, "stock_quantity": 2, "serial_number": "2222", "picture": "https://picture2"}
]

const customersData = [
    {"id": 1, "company_name": "company1", "siret": "1111111111", "phone_number": "1111111111"},
    {"id": 2, "company_name": "company2", "siret": "2222222222", "phone_number": "2222222222"}
]

describe('CreateBill.vue', () => {
    let store;
    let options;
    let state = {
        products: [],
        customers: []
    };


    /*jest.mock('@/views/CreateBill', () => ({
        getProducts: jest.fn(async () => {
            return Promise.resolve([{"id":1,"name":"product1","price":100,"stock_quantity":1,"serial_number":"1111","picture":"https://picture1"},
                {"id":2,"name":"product2","price":200,"stock_quantity":2,"serial_number":"2222","picture":"https://picture2"}])
        })
    }))*/


    describe('getProductsAndCustomers', () => {
        beforeEach(() => {
            state = {
                products: [],
                customers: []
            }

            store = new Vuex.Store({
                state
            })

            options = {
                mocks: {
                    $vuetify: {
                        breakpoint: {
                            xs: true
                        }
                    }
                },
                localVue,
                store
            }
        })

        let products = []
        let customers = []

        const mockGetProducts = jest.spyOn(CreateBill.methods, 'getProducts').mockImplementation(() => {
            products = productsData
            state.products = products
        })

        const mockGetCustomers = jest.spyOn(CreateBill.methods, 'getCustomers').mockImplementation(() => {
            customers = customersData
            state.customers = customers
        })

        it('call APIs and set store if store is empty', async () => {
            //* arrange
            const wrapper = shallowMount(CreateBill, options)


            //* act
            await wrapper.vm.getProductsAndCustomers()

            //* assert
            expect(mockGetProducts).toHaveBeenCalled()
            expect(mockGetCustomers).toHaveBeenCalled()
            expect(products).toEqual(productsData)
            expect(customers).toEqual(customersData)
        })

        it('does not call APIs if the store is not empty', async () => {

            state = {
                products: productsData,
                customers: customersData
            }

            store = new Vuex.Store({
                state
            })

            options.store = store
            //* arrange
            const wrapper = shallowMount(CreateBill, options)


            //* act
            await wrapper.vm.getProductsAndCustomers()

            //* assert
            expect(mockGetProducts).not.toHaveBeenCalled()
            expect(mockGetCustomers).not.toHaveBeenCalled()

            /*expect(products).toEqual([
                {"id": 1, "name": "product1", "price": 100, "stock_quantity": 1, "serial_number": "1111", "picture": "https://picture1"},
                {"id": 2, "name": "product2", "price": 200, "stock_quantity": 2, "serial_number": "2222", "picture": "https://picture2"}
            ])
            expect(customers).toEqual([
                {"id": 1, "company_name": "company1", "siret": "1111111111", "phone_number": "1111111111"},
                {"id": 2, "company_name": "company2", "siret": "2222222222", "phone_number": "2222222222"}
            ])*/
        })


        })
    })