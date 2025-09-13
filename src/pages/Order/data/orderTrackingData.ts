export const orderTrackindData:any = {
    "Order": {
        "TrackCode": "213213",
        "States": [
            {
                "Title": "درخواست خرید",
                "EnglishTitleName": "request",
                "StateId": 1,
                "QtyParts": [
                    {
                        "PartId": 1212,
                        "PartTitle": "قطعه A",
                        "qty": 15
                    },
                    {
                        "PartId": 1210,
                        "PartTitle": "قطعه B",
                        "qty": 10
                    }
                ]
            },
            {
                "Title": "خرید مواد اولیه",
                "EnglishTitleName": "sell",
                "StateId": 2,
                "QtyParts": [
                    {
                        "PartId": 1212,
                        "PartTitle": "قطعه A",
                        "qty": 15
                    },
                    {
                        "PartId": 1210,
                        "PartTitle": "قطعه B",
                        "qty": 10
                    }
                ]
            }
        ],
        "EqPart": [
            {
                "Name": "P1",
                "Count": "50",
                "States": [
                    {
                        "Title": "درخواست خرید",
                        StateId: 1,
                        "EnglishTitleName": "request",
                        "StateCount": "15"
                    },
                    {
                        "Title": "خرید مواد اولیه",
                        StateId:2,
                        "EnglishTitleName": "sell",
                        "StateCount": "10"
                    }
                ]
            },
            {
                "Name": "P2",
                "Count": "20",
                "States": [
                    {
                        "Title": "درخواست خرید",
                        StateId: 1,
                        "EnglishTitleName": "request",
                        "StateCount": "5"
                    },
                    {
                        "Title": "خرید مواد اولیه",
                        StateId: 2,
                        "EnglishTitleName": "sell",
                        "StateCount": "10"
                    },
                ]
            }
        ]
    }
}