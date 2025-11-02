import express from 'express';
import cors from 'cors';
import { env } from './config/env';
import { connectToDatabase } from './config/db';
import userRouter from './routes/user.routes'
import bookingRoutes from "./routes/booking.routes";
import paymentRoutes from "./routes/payment.routes";

async function bootstrap() {
	const app = express();

	// ✅ UPDATED CORS - Allow port 5173
	app.use(cors({
		origin: ['http://localhost:5173', 'http://localhost:5174'],
		credentials: true
	}));
	
	app.use(express.json());

	app.get('/health', (_req, res) => {
		return res.json({ status: 'ok' });
	});

	// Connect to MongoDB FIRST before setting up routes
	try {
		await connectToDatabase();
		console.log('✅ MongoDB connected successfully');
	} catch (error) {
		console.error('❌ MongoDB connection failed:', error);
		process.exit(1);
	}

	// Now set up routes AFTER database connection
	app.use('/api/users', userRouter);
	app.use("/api/bookings", bookingRoutes);
	app.use("/api/payment", paymentRoutes);
	
	app.listen(env.port, () => {
		console.log(`✅ Server running on http://localhost:${env.port}`);
		console.log(`🔗 Accepting requests from http://localhost:5173 and http://localhost:5174`);
	});
}

bootstrap().catch((error) => {
	console.error('❌ Failed to start server', error);
	process.exit(1);
});