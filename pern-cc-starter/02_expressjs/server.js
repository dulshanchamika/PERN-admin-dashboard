import express, { json } from 'express';

const app = express();
const port = 3000;

const router = express.Router();

app.use(express.json());

app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${req.method} ${req.originalUrl}`);
    next();
});

let cars = [
    { id: 1, make: 'Toyota', model: 'Corolla', year: 2020 },
    { id: 2, make: 'Honda', model: 'Civic', year: 2019 },
    { id: 3, make: 'Ford', model: 'Mustang', year: 2021 },
    { id: 4, make: 'Chevrolet', model: 'Camaro', year: 2018 }
]

app.get('/', (req, res) => {
    res.send('Hello, from the server!');
});

router.get('/', (req, res) => {
    res.json(cars);
});

router.get('/:id', (req, res) => {
    const id = Number(req.params.id);
    const car = cars.find((car) => car.id === id);

    if (!car) {
        return res.status(404).json({ message: 'Car not found' });
    }

    res.json(car);
});

router.post('/', (req, res) => {
    const { make, model, year } = req.body;

    if (!make || !model || !year) {
        return res.status(400).json({ message: 'Make, model, and year are required' });
    }

    const newCar = {
        id: cars.length + 1,
        make,
        model,
        year
    };
    cars.push(newCar);
    res.status(201).json(newCar);
}
);

router.put('/:id', (req, res) => {
    const id = Number(req.params.id);
    const index = cars.findIndex((car) => car.id === id);

    if (index === -1) {
        return res.status(404).json({ message: 'Car not found' });
    }

    const { make, model, year } = req.body;

    if (make) cars[index].make = make;
    if (model) cars[index].model = model;
    if (year) cars[index].year = Number(year);

    res.json(cars[index]);
});

router.delete('/:id', (req, res) => {
    const id = Number(req.params.id);
    const index = cars.findIndex((car) => car.id === id);

    if (index === -1) {
        return res.status(404).json({ message: 'Car not found' });
    }

    const deletedCar = cars.splice(index, 1)[0];
    res.json({ message: 'Car deleted', car: deletedCar});
});

app.use('/api/v1/cars', router);

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});