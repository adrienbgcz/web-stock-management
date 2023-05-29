import CreateBill from "@/views/CreateBill";
import {shallowMount, createLocalVue} from "@vue/test-utils";
import Vuex from 'vuex'
import Vuetify from 'vuetify'

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
    }

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

    const breakpoint = {
        init: jest.fn(),
        xs: true,
    }
    const vuetify = new Vuetify()
    vuetify.framework.breakpoint = breakpoint


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
                vuetify,
                localVue,
                store
            }
        })


        it('call APIs and set store if store is empty', async () => {
            //* arrange
            const wrapper = shallowMount(CreateBill, options)


            //!* act
            await wrapper.vm.getProductsAndCustomers()

            //!* assert
            expect(mockGetProducts).toHaveBeenCalled()
            expect(mockGetCustomers).toHaveBeenCalled()
            expect(products).toEqual(productsData)
            expect(customers).toEqual(customersData)
            expect(state.products).toEqual(productsData)
            expect(state.customers).toEqual(customersData)
        })

        /*it('does not call APIs if the store is not empty', async () => {

            //!* arrange
            const wrapper = shallowMount(CreateBill, options)


            //!* act
            await wrapper.vm.getProductsAndCustomers()

            //!* assert
            expect(mockGetProducts).not.toHaveBeenCalled()
            expect(mockGetCustomers).not.toHaveBeenCalled()

            expect(products).toEqual(productsData)
            expect(customers).toEqual(customersData)
        })*/


    })


    describe('createBill', () => {


        beforeEach(() => {
            state = {
                products: [],
                customers: []
            }

            store = new Vuex.Store({
                state
            })

            options = {
                vuetify,
                localVue,
                store
            }
        })


        const mockCreateBillAndGetBillId = jest.spyOn(CreateBill.methods, 'createBillAndGetBillId').mockImplementation(() => {
            throw ("error")
        })

        const mockPostTransactions = jest.spyOn(CreateBill.methods, 'postTransactions')


        it('does not create transaction if bill id is null', async () => {

            //* arrange
            const wrapper = shallowMount(CreateBill, options)

            //!* act
            try{
                await wrapper.vm.createBill()
            } catch (e) {
                console.log(e)
            }

            //!* assert
            expect(mockCreateBillAndGetBillId).toHaveBeenCalled()
            expect(mockPostTransactions).not.toHaveBeenCalled()

        })


    })
})

