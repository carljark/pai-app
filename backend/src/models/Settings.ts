import mongoose from 'mongoose';

const SettingsSchema = new mongoose.Schema({
  schoolName: { type: String, default: '' },
  schoolCity: { type: String, default: '' },
  schoolContext: { type: String, default: '' },
  isSingleton: { type: Boolean, default: true, unique: true }
});

export const Settings = mongoose.model('Settings', SettingsSchema);
