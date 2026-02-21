import { ObjectId } from 'mongodb';
import mongodb from '../db/connection';
import { get } from 'http';
import { flattenObject } from '../utilities';
import type { Request, Response } from 'express';


export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const result = await mongodb.getDb().db('RandR').collection('User').find().toArray();
    res.status(200).json(result);
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).json({message: err.message});
    } else {
      res.status(500).json({message: 'An unknown error occurred'});
    }
  }
};


export const getUserById = async (req: Request, res: Response) => {
    try{
    const id = new ObjectId(req.params.id);
    const result = await mongodb.getDb().db('RandR').collection('User').findOne({ _id: id})
    res.status(200).json(result);
    } catch (err) {
      if (err instanceof Error) {
      res.status(500).json({message: err.message || 'Cannot Get User'});
    } else {
      res.status(500).json({message: 'An unknown error occurred'});
    }
  }
}

export const getUserByGoogleId = async (req: Request, res: Response) => {
    try{
    const id = req.params.id;
    const result = await mongodb.getDb().db('RandR').collection('User').findOne({ googleId: id})
    res.status(200).json(result);
    } catch (err) {
        if (err instanceof Error) {
      res.status(500).json({message: err.message || 'Cannot Get User'});
    } else {
      res.status(500).json({message: 'An unknown error occurred'});
    }
  }
}

export const createUser = async (req: Request, res: Response) => {
  try {
    const {
      profile,
      experienceLevel = 1,
      primaryGoal = "general_fitness",
      secondaryGoals = [],
      availableEquipment = [],
      workoutDurationMinutes = 30,
      contraindications = [],
      activeInjuries = []
    } = req.body;

    if (!profile?.firstName || !profile?.lastName) {
      return res.status(400).json({ message: "Missing required profile data" });
    }

    const now = new Date();

    const newUser = {

      profile: {
        firstName: profile.firstName,
        lastName: profile.lastName,
        age: profile.age ?? null,
        heightCm: profile.heightCm ?? null,
        weightKg: profile.weightKg ?? null
      },

      strengthProfile: {
        upperBody: [
          { muscleId: "chest", strength: 0 },
          { muscleId: "anterior_deltoids", strength: 0 },
          { muscleId: "lateral_deltoids", strength: 0 },
          { muscleId: "posterior_deltoids", strength: 0 },
          { muscleId: "biceps", strength: 0 },
          { muscleId: "triceps", strength: 0 },
          { muscleId: "forearms", strength: 0 },
          { muscleId: "latissimus_dorsi", strength: 0 },
          { muscleId: "rhomboids", strength: 0 },
          { muscleId: "middle_trapezius", strength: 0 },
          { muscleId: "lower_trapezius", strength: 0 }
        ],

        core: [
          { muscleId: "rectus_abdominis", strength: 0 },
          { muscleId: "transverse_abdominis", strength: 0 },
          { muscleId: "internal_obliques", strength: 0 },
          { muscleId: "external_obliques", strength: 0 },
          { muscleId: "erector_spinae", strength: 0 }
        ],

        lowerBody: [
          { muscleId: "gluteus_maximus", strength: 0 },
          { muscleId: "gluteus_medius", strength: 0 },
          { muscleId: "quadriceps", strength: 0 },
          { muscleId: "hamstrings", strength: 0 },
          { muscleId: "adductors", strength: 0 },
          { muscleId: "calves", strength: 0 }
        ]
      },

      mobilityProfile: {
        upperBody: {
          shoulders: 0,
          elbows: 0,
          wrists: 0,
          thoracic_spine: 0
        },
        lowerBody: {
          hips: 0,
          knees: 0,
          ankles: 0
        },
        balance: 0
      },

      preferences: {
        primaryGoal,
        secondaryGoals,
        availableEquipment,
        workoutDurationMinutes
      },

      exercisePreferences: {
        likes: [],
        dislikes: [],
        avoidIfPossible: []
      },

      restrictions: {
        contraindications
      },

      rehabState: {
        activeInjuries
      },

      activity: {
        experienceLevel,
        sessionsPerWeek: 3
      },

      system: {
        active: true,
        createdAt: now,
        updatedAt: now
      }
    };

    const db = mongodb.getDb().db("RandR");
    const result = await db.collection("User").insertOne(newUser);

    if (!result.acknowledged) {
      return res.status(500).json({ message: "Failed to create user" });
    }

    res.status(201).json({
      message: "User created",
      userId: result.insertedId,
    });

  } catch (err) {
      if (err instanceof Error) {
    res.status(500).json({ message: "Server error", error: err.message });
  } else {
    res.status(500).json({ message: "Server error", error: 'An unknown error occurred' });
  }
}
};


export const updateUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;

    if (!ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

const ALLOWED_UPDATE_PATHS = [
  // profile
  "profile.firstName",
  "profile.lastName",
  "profile.age",
  "profile.heightCm",
  "profile.weightKg",

  // preferences
  "preferences.primaryGoal",
  "preferences.secondaryGoals",
  "preferences.availableEquipment",
  "preferences.workoutDurationMinutes",

  // exercise preferences
  "exercisePreferences.likes",
  "exercisePreferences.dislikes",
  "exercisePreferences.avoidIfPossible",

  // mobility
  "mobilityProfile.upperBody",
  "mobilityProfile.lowerBody",
  "mobilityProfile.balance",

  // strength (can be refined later to muscle-level)
  "strengthProfile.upperBody",
  "strengthProfile.core",
  "strengthProfile.lowerBody",

  // rehab & restrictions
  "rehabState.activeInjuries",
  "restrictions.contraindications",

  // activity
  "activity.experienceLevel",
  "activity.sessionsPerWeek"
];

    const flattenedUpdates = flattenObject(req.body);

    const updates: { [key: string]: any } = {};

    for (const key of Object.keys(flattenedUpdates)) {
      if (ALLOWED_UPDATE_PATHS.includes(key)) {
        updates[key] = flattenedUpdates[key];
      }
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: "No valid fields to update" });
    }

    updates["system.updatedAt"] = new Date();

    const db = mongodb.getDb().db("RandR");
    const result = await db.collection("User").updateOne(
      { _id: new ObjectId(userId) },
      { $set: updates }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User updated successfully",
      updatedFields: Object.keys(updates)
    });

  } catch (err) {
    if (err instanceof Error) {
    res.status(500).json({ message: "Server error", error: err.message });
  } else {
    res.status(500).json({ message: "Server error", error: 'An unknown error occurred' });
  }
  }
};


export const deleteUser = async (req: Request, res: Response) => {
  const id = new ObjectId(req.params.id);
  const del = await mongodb.getDb().db('RandR').collection('User').deleteOne({_id: id});
  if(del.deletedCount > 0)
    {
      res.status(204).send();
    }else{
  res.status(400).json({ message: "Failed to delete user" });
 }
};
