import Product from "../../../src/models/product";

describe('Routes: Products', () => {

    const defaultId = '56cb91bdc3464f14678934ca';
    const defaultProduct = {
        name: 'Default product',
        description: 'product description',
        price: 100
    };
    const expectedProduct = {
        __v: 0,
        _id: defaultId,
        name: 'Default product',
        description: 'product description',
        price: 100
    };

    let request;
    let app;

    before(async () => {
        app = await setupApp();
        request = supertest(app);
    });

    beforeEach(async () => {
        await Product.deleteMany();

        const product = new Product(defaultProduct);
        product._id = defaultId;
        return await product.save();
    });

    after(async () => await app.database.connection.close());
    afterEach(async () => await Product.deleteMany());

    describe('GET /products', () => {
        it('should return a list of products', done => {

            request
                .get('/products')
                .end((err, res) => {
                    expect(res.body).to.eql([expectedProduct]);
                    done(err);
                });
        });

        context('when an id is specified', done => {
            it('should return 200 with one product', done => {
                request
                    .get(`/products/${defaultId}`)
                    .end((err, res) => {
                        expect(res.statusCode).to.eql(200);
                        expect(res.body).to.eql([expectedProduct]);
                        done(err);
                    });
            });
        });
    });

    describe('POST /products', () => {
        context('when posting a product', () => {
            it('should return a new product with status code 201', done => {
                const customId = '56cb91bdc3464f14678934ba';
                const newProduct = Object.assign({}, { _id: customId, __v: 0 }, defaultProduct);
                const expectedSavedProduct = {
                    __v: 0,
                    _id: customId,
                    name: 'Default product',
                    description: 'product description',
                    price: 100
                };

                request
                    .post('/products')
                    .send(newProduct)
                    .end((err, res) => {
                        expect(res.statusCode).to.eql(201);
                        expect(res.body).to.eql(expectedSavedProduct);
                        done(err);
                    });
            });
        });
    });
});