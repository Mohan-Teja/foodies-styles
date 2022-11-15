import { Star, StarBorder, StarHalf } from '@mui/icons-material'
import React from 'react'

const Rating = ({ value, text }) => {
    return (
        <div>
            <span>
                {
                    (value >= 1) ? (
                        <Star />
                    ) : (
                        (value >= 0.5) ? (
                            <StarHalf />
                        ) : (
                            <StarBorder />
                        )
                    )
                }
            </span>

            <span>
                {
                    (value >= 2) ? (
                        <Star />
                    ) : (
                        (value >= 1.5) ? (
                            <StarHalf />
                        ) : (
                            <StarBorder />
                        )
                    )
                }
            </span>

            <span>
                {
                    (value >= 3) ? (
                        <Star />
                    ) : (
                        (value >= 2.5) ? (
                            <StarHalf />
                        ) : (
                            <StarBorder />
                        )
                    )
                }
            </span>

            <span>
                {
                    (value >= 4) ? (
                        <Star />
                    ) : (
                        (value >= 3.5) ? (
                            <StarHalf />
                        ) : (
                            <StarBorder />
                        )
                    )
                }
            </span>

            <span>
                {
                    (value >= 5) ? (
                        <Star />
                    ) : (
                        (value >= 4.5) ? (
                            <StarHalf />
                        ) : (
                            <StarBorder />
                        )
                    )
                }
            </span>

            <span className='ml-1'>({text && text})</span>
        </div>
    )
}

export default Rating