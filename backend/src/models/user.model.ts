import mongoose, { Schema, Document, Model } from 'mongoose';

export interface UserAttrs {
	fullName: string;
	email: string;
	password: string;
}

export interface UserDocument extends Document, UserAttrs {
	userId: string;
	createdAt: Date;
	updatedAt: Date;
}

const userSchema = new Schema<UserDocument>(
	{
		userId: {
			type: String,
			unique: true,
			// ✅ REMOVED required: true - will be generated automatically
		},
		fullName: {
			type: String,
			required: true,
			trim: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
			lowercase: true,
			trim: true,
		},
		password: {
			type: String,
			required: true,
			minlength: 6,
		},
	},
	{ timestamps: true }
);

// ✅ Generate unique userId BEFORE validation runs
userSchema.pre('validate', function (next) {
	if (!this.userId) {
		this.userId = `USER-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
	}
	next();
});

// Create indexes
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ userId: 1 }, { unique: true });

export const User: Model<UserDocument> =
	mongoose.models.User || mongoose.model<UserDocument>('User', userSchema);